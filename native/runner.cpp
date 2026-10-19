// Executes one local practice submission, with wall-time and output limits.
// This is process supervision, not a security sandbox for untrusted programs.
#include <algorithm>
#include <chrono>
#include <cstdint>
#include <iostream>
#include <limits>
#include <string>
#include <vector>

#ifdef _WIN32
#ifndef _WIN32_WINNT
#define _WIN32_WINNT 0x0601
#endif
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#else
#include <cerrno>
#include <csignal>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <thread>
#include <unistd.h>
#endif

namespace {
using Clock = std::chrono::steady_clock;
using Milliseconds = std::chrono::milliseconds;

struct Result {
    const char* status = "ERROR";
    std::int64_t exitCode = -1;
    std::int64_t timeMs = 0;
};

std::int64_t elapsed(const Clock::time_point& start) {
    return std::chrono::duration_cast<Milliseconds>(Clock::now() - start).count();
}

void emit(const Result& result) {
    std::cout << "{\"status\":\"" << result.status << "\",\"exitCode\":"
              << result.exitCode << ",\"timeMs\":" << result.timeMs << "}\n";
}

template <typename String>
bool positiveNumber(const String& value, std::uint64_t& parsed) {
    if (value.empty()) return false;
    parsed = 0;
    for (const auto ch : value) {
        if (ch < '0' || ch > '9') return false;
        const auto digit = static_cast<unsigned int>(ch - '0');
        if (parsed > (static_cast<std::uint64_t>(
                          std::numeric_limits<std::int64_t>::max()) - digit) / 10)
            return false;
        parsed = parsed * 10 + digit;
    }
    return parsed > 0;
}

bool overLimit(std::uint64_t out, std::uint64_t err, std::uint64_t limit) {
    return out > limit || err > limit - out;
}

#ifdef _WIN32
class Handle {
public:
    explicit Handle(HANDLE value = nullptr) : value_(value) {}
    ~Handle() { reset(); }
    Handle(const Handle&) = delete;
    Handle& operator=(const Handle&) = delete;
    HANDLE get() const { return value_; }
    bool valid() const { return value_ && value_ != INVALID_HANDLE_VALUE; }
    void reset(HANDLE value = nullptr) {
        if (valid()) CloseHandle(value_);
        value_ = value;
    }
private:
    HANDLE value_;
};

// Read Unicode arguments independently of the active Windows ANSI code page.
// These are the CRT quoting rules: only backslashes immediately preceding a
// quote have special meaning. The executable's argv[0] is discarded below.
std::vector<std::wstring> windowsArguments() {
    const wchar_t* cursor = GetCommandLineW();
    std::vector<std::wstring> args;
    while (*cursor) {
        while (*cursor == L' ' || *cursor == L'\t') ++cursor;
        if (!*cursor) break;
        std::wstring arg;
        bool quoted = false;
        while (*cursor && (quoted || (*cursor != L' ' && *cursor != L'\t'))) {
            std::size_t slashes = 0;
            while (*cursor == L'\\') { ++slashes; ++cursor; }
            if (*cursor == L'"') {
                arg.append(slashes / 2, L'\\');
                if (slashes % 2) {
                    arg.push_back(L'"');
                    ++cursor;
                } else {
                    ++cursor;
                    if (quoted && *cursor == L'"') {
                        arg.push_back(L'"');
                        ++cursor;
                    } else {
                        quoted = !quoted;
                    }
                }
            } else {
                arg.append(slashes, L'\\');
                if (!*cursor || (!quoted && (*cursor == L' ' || *cursor == L'\t')))
                    break;
                arg.push_back(*cursor++);
            }
        }
        args.push_back(std::move(arg));
    }
    return args;
}

std::wstring quoteArgument(const std::wstring& value) {
    std::wstring quoted = L"\"";
    std::size_t slashes = 0;
    for (const auto ch : value) {
        if (ch == L'\\') {
            ++slashes;
        } else {
            quoted.append(ch == L'"' ? slashes * 2 + 1 : slashes, L'\\');
            quoted.push_back(ch);
            slashes = 0;
        }
    }
    quoted.append(slashes * 2, L'\\');
    quoted.push_back(L'"');
    return quoted;
}

bool fileSize(HANDLE file, std::uint64_t& size) {
    LARGE_INTEGER bytes{};
    if (!GetFileSizeEx(file, &bytes) || bytes.QuadPart < 0) return false;
    size = static_cast<std::uint64_t>(bytes.QuadPart);
    return true;
}

Result execute(const std::vector<std::wstring>& args, std::uint64_t timeout,
               std::uint64_t limit) {
    Result result;
    SECURITY_ATTRIBUTES security{sizeof(SECURITY_ATTRIBUTES), nullptr, TRUE};
    Handle input(CreateFileW(args[2].c_str(), GENERIC_READ, FILE_SHARE_READ,
                             &security, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, nullptr));
    if (!input.valid()) return result;
    const DWORD sharing = FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE;
    Handle output(CreateFileW(args[3].c_str(), GENERIC_WRITE, sharing, &security,
                              CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr));
    if (!output.valid()) return result;
    Handle error(CreateFileW(args[4].c_str(), GENERIC_WRITE, sharing, &security,
                             CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, nullptr));
    if (!error.valid()) return result;

    Handle job(CreateJobObjectW(nullptr, nullptr));
    if (!job.valid()) return result;
    JOBOBJECT_EXTENDED_LIMIT_INFORMATION limits{};
    limits.BasicLimitInformation.LimitFlags = JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE;
    if (!SetInformationJobObject(job.get(), JobObjectExtendedLimitInformation,
                                 &limits, sizeof(limits))) return result;

    SIZE_T attributeBytes = 0;
    InitializeProcThreadAttributeList(nullptr, 1, 0, &attributeBytes);
    std::vector<unsigned char> storage(attributeBytes);
    auto* attributes = reinterpret_cast<LPPROC_THREAD_ATTRIBUTE_LIST>(storage.data());
    if (!InitializeProcThreadAttributeList(attributes, 1, 0, &attributeBytes))
        return result;
    HANDLE inherited[] = {input.get(), output.get(), error.get()};
    if (!UpdateProcThreadAttribute(attributes, 0, PROC_THREAD_ATTRIBUTE_HANDLE_LIST,
                                    inherited, sizeof(inherited), nullptr, nullptr)) {
        DeleteProcThreadAttributeList(attributes);
        return result;
    }

    STARTUPINFOEXW startup{};
    startup.StartupInfo.cb = sizeof(startup);
    startup.StartupInfo.dwFlags = STARTF_USESTDHANDLES;
    startup.StartupInfo.hStdInput = input.get();
    startup.StartupInfo.hStdOutput = output.get();
    startup.StartupInfo.hStdError = error.get();
    startup.lpAttributeList = attributes;
    PROCESS_INFORMATION processInfo{};
    std::wstring command = quoteArgument(args[1]);
    const BOOL created = CreateProcessW(
        args[1].c_str(), command.data(), nullptr, nullptr, TRUE,
        CREATE_NO_WINDOW | CREATE_SUSPENDED | EXTENDED_STARTUPINFO_PRESENT,
        nullptr, nullptr, &startup.StartupInfo, &processInfo);
    DeleteProcThreadAttributeList(attributes);
    if (!created) return result;
    Handle process(processInfo.hProcess);
    Handle thread(processInfo.hThread);
    if (!AssignProcessToJobObject(job.get(), process.get())) {
        TerminateProcess(process.get(), 1);
        WaitForSingleObject(process.get(), INFINITE);
        return result;
    }
    const auto start = Clock::now();
    if (ResumeThread(thread.get()) == static_cast<DWORD>(-1)) {
        TerminateJobObject(job.get(), 1);
        WaitForSingleObject(process.get(), INFINITE);
        return result;
    }
    thread.reset();

    bool forced = false;
    for (;;) {
        std::uint64_t outBytes = 0, errBytes = 0;
        if (!fileSize(output.get(), outBytes) || !fileSize(error.get(), errBytes)) {
            forced = true;
            break;
        }
        if (overLimit(outBytes, errBytes, limit)) {
            result.status = "OLE";
            forced = true;
            break;
        }
        const DWORD state = WaitForSingleObject(process.get(), 0);
        if (state == WAIT_OBJECT_0) break;
        if (state != WAIT_TIMEOUT) { forced = true; break; }
        const auto used = elapsed(start);
        if (static_cast<std::uint64_t>(used) >= timeout) {
            result.status = "TLE";
            forced = true;
            break;
        }
        const auto remaining = timeout - static_cast<std::uint64_t>(used);
        WaitForSingleObject(process.get(), static_cast<DWORD>(std::min<std::uint64_t>(5, remaining)));
    }
    if (forced) TerminateJobObject(job.get(), 1);
    WaitForSingleObject(process.get(), INFINITE);
    DWORD code = 0;
    if (GetExitCodeProcess(process.get(), &code)) result.exitCode = code;
    result.timeMs = elapsed(start);

    // Closing the job also kills descendants when the main program exits first.
    job.reset();
    std::uint64_t outBytes = 0, errBytes = 0;
    if (!forced) {
        if (!fileSize(output.get(), outBytes) || !fileSize(error.get(), errBytes))
            result.status = "ERROR";
        else if (overLimit(outBytes, errBytes, limit)) result.status = "OLE";
        else result.status = result.exitCode == 0 ? "OK" : "RE";
    }
    return result;
}
#else
class File {
public:
    explicit File(int fd = -1) : fd_(fd) {}
    ~File() { if (fd_ >= 0) close(fd_); }
    File(const File&) = delete;
    File& operator=(const File&) = delete;
    int get() const { return fd_; }
private:
    int fd_;
};

bool fileSize(int fd, std::uint64_t& size) {
    struct stat information{};
    if (fstat(fd, &information) != 0 || information.st_size < 0) return false;
    size = static_cast<std::uint64_t>(information.st_size);
    return true;
}

void killTree(pid_t child, bool leaderAlive) {
    // The child creates its own session before exec; never target our own group.
    kill(-child, SIGKILL);
    if (leaderAlive) kill(child, SIGKILL); // Covers a child stopped before setsid.
}

Result execute(const std::vector<std::string>& args, std::uint64_t timeout,
               std::uint64_t limit) {
    Result result;
    File input(open(args[2].c_str(), O_RDONLY));
    if (input.get() < 0) return result;
    File output(open(args[3].c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0600));
    if (output.get() < 0) return result;
    File error(open(args[4].c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0600));
    if (error.get() < 0) return result;
    int errorPipe[2];
    if (pipe(errorPipe) != 0) return result;
    File execErrors(errorPipe[0]);
    if (fcntl(errorPipe[1], F_SETFD, FD_CLOEXEC) < 0 ||
        fcntl(errorPipe[0], F_SETFL, O_NONBLOCK) < 0) {
        close(errorPipe[1]);
        return result;
    }
    const auto start = Clock::now();
    const pid_t child = fork();
    if (child < 0) { close(errorPipe[1]); return result; }
    if (child == 0) {
        close(errorPipe[0]);
        auto fail = [&]() {
            const int failure = errno;
            const auto ignored = write(errorPipe[1], &failure, sizeof(failure));
            (void)ignored;
            _exit(127);
        };
        if (setsid() < 0) fail();
        if (dup2(input.get(), STDIN_FILENO) < 0 ||
            dup2(output.get(), STDOUT_FILENO) < 0 ||
            dup2(error.get(), STDERR_FILENO) < 0) fail();
        if (input.get() > STDERR_FILENO) close(input.get());
        if (output.get() > STDERR_FILENO) close(output.get());
        if (error.get() > STDERR_FILENO) close(error.get());
        execl(args[1].c_str(), args[1].c_str(), static_cast<char*>(nullptr));
        fail();
    }
    close(errorPipe[1]);
    int waitStatus = 0;
    bool forced = false;
    bool reaped = false;
    for (;;) {
        std::uint64_t outBytes = 0, errBytes = 0;
        if (!fileSize(output.get(), outBytes) || !fileSize(error.get(), errBytes)) {
            forced = true;
            break;
        }
        if (overLimit(outBytes, errBytes, limit)) {
            result.status = "OLE";
            forced = true;
            break;
        }
        const auto state = waitpid(child, &waitStatus, WNOHANG);
        if (state == child) { reaped = true; break; }
        if (state < 0 && errno != EINTR) { forced = true; break; }
        const auto used = elapsed(start);
        if (static_cast<std::uint64_t>(used) >= timeout) {
            result.status = "TLE";
            forced = true;
            break;
        }
        const auto remaining = timeout - static_cast<std::uint64_t>(used);
        std::this_thread::sleep_for(Milliseconds(std::min<std::uint64_t>(5, remaining)));
    }
    killTree(child, !reaped); // Kill descendants when their parent exits first.
    if (!reaped) {
        pid_t state;
        do { state = waitpid(child, &waitStatus, 0); } while (state < 0 && errno == EINTR);
        reaped = state == child;
    }
    result.timeMs = elapsed(start);
    if (reaped) {
        if (WIFEXITED(waitStatus)) result.exitCode = WEXITSTATUS(waitStatus);
        else if (WIFSIGNALED(waitStatus)) result.exitCode = 128 + WTERMSIG(waitStatus);
    }
    int execError = 0;
    const auto errorBytes = read(execErrors.get(), &execError, sizeof(execError));
    if (errorBytes > 0) result.status = "ERROR";
    else if (!forced) {
        std::uint64_t outBytes = 0, errBytes = 0;
        if (!fileSize(output.get(), outBytes) || !fileSize(error.get(), errBytes))
            result.status = "ERROR";
        else if (overLimit(outBytes, errBytes, limit)) result.status = "OLE";
        else result.status = result.exitCode == 0 ? "OK" : "RE";
    }
    return result;
}
#endif
} // namespace

int main(int argc, char* argv[]) {
    try {
#ifdef _WIN32
        SetErrorMode(SEM_FAILCRITICALERRORS | SEM_NOGPFAULTERRORBOX | SEM_NOOPENFILEERRORBOX);
        const auto args = windowsArguments();
        (void)argc;
        (void)argv;
#else
        const std::vector<std::string> args(argv, argv + argc);
#endif
        std::uint64_t timeout = 0, limit = 0;
        if (args.size() != 7 || !positiveNumber(args[5], timeout) ||
            !positiveNumber(args[6], limit)) {
            emit(Result{});
            return 2;
        }
        emit(execute(args, timeout, limit));
        return 0;
    } catch (...) {
        emit(Result{});
        return 0;
    }
}
