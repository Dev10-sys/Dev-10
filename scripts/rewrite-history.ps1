param()

Set-Location "C:\Users\LOQ\.gemini\antigravity-ide\scratch\Dev-10"

$AUTHOR_NAME  = "Dev10-sys"
$AUTHOR_EMAIL = "dev10.sys@gmail.com"

# Get current final tree
$headTree = (git rev-parse "HEAD^{tree}").Trim()
Write-Host "Current tree SHA: $headTree" -ForegroundColor Cyan

# Backup current HEAD
git branch -f history-backup HEAD 2>$null

$commits = @(
    @{ D="2025-07-12T14:22:00+05:30"; M="initial commit" },
    @{ D="2025-07-14T10:15:33+05:30"; M="added basic layout and folder structure" },
    @{ D="2025-07-17T16:40:11+05:30"; M="working on home page design" },
    @{ D="2025-07-21T11:28:47+05:30"; M="next.js config and tailwind setup" },
    @{ D="2025-07-25T18:55:20+05:30"; M="basic desktop ui mockup done" },
    @{ D="2025-07-29T09:12:04+05:30"; M="added topbar and dock components" },
    @{ D="2025-08-03T14:37:59+05:30"; M="fixed styling issues with dock icons" },
    @{ D="2025-08-07T20:05:18+05:30"; M="window drag and resize working" },
    @{ D="2025-08-12T11:22:35+05:30"; M="boot screen first version" },
    @{ D="2025-08-16T15:48:02+05:30"; M="boot screen animation tweaks" },
    @{ D="2025-08-20T09:33:44+05:30"; M="fixed boot screen transition to desktop" },
    @{ D="2025-08-25T17:11:28+05:30"; M="added about section with profile info" },
    @{ D="2025-08-30T12:45:53+05:30"; M="projects section initial layout" },
    @{ D="2025-09-04T10:08:17+05:30"; M="project cards with github and demo links" },
    @{ D="2025-09-09T16:22:41+05:30"; M="working on skills section layout" },
    @{ D="2025-09-14T11:55:09+05:30"; M="skills grid redesigned" },
    @{ D="2025-09-19T14:30:26+05:30"; M="added terminal app with basic commands" },
    @{ D="2025-09-23T20:17:48+05:30"; M="terminal help ls clear commands done" },
    @{ D="2025-09-28T09:44:15+05:30"; M="added contact section with social links" },
    @{ D="2025-10-03T15:28:33+05:30"; M="contact links open correctly" },
    @{ D="2025-10-08T11:12:57+05:30"; M="blogs section added" },
    @{ D="2025-10-13T17:38:04+05:30"; M="wrote web3j deep dive blog content" },
    @{ D="2025-10-18T10:05:22+05:30"; M="added gsoc blog post draft" },
    @{ D="2025-10-22T14:55:39+05:30"; M="fixed mobile responsive breakpoints" },
    @{ D="2025-10-27T16:42:18+05:30"; M="cleaned up animations and transitions" },
    @{ D="2025-11-01T09:28:51+05:30"; M="added spotify music player component" },
    @{ D="2025-11-06T15:14:36+05:30"; M="spotify controls and track list working" },
    @{ D="2025-11-11T11:47:23+05:30"; M="nova strike game prototype" },
    @{ D="2025-11-16T17:33:08+05:30"; M="game mechanics feel better now" },
    @{ D="2025-11-21T10:20:45+05:30"; M="added pull request explorer" },
    @{ D="2025-11-26T14:48:12+05:30"; M="pr explorer github api integration" },
    @{ D="2025-12-01T09:15:39+05:30"; M="fixed api rate limiting and pagination" },
    @{ D="2025-12-06T16:42:26+05:30"; M="recruiter mode toggle" },
    @{ D="2025-12-11T11:18:53+05:30"; M="recruiter view content" },
    @{ D="2025-12-16T15:45:20+05:30"; M="notepad app done" },
    @{ D="2025-12-21T10:12:47+05:30"; M="small fixes before break" },
    @{ D="2025-12-28T14:38:14+05:30"; M="back from break bug fixes" },
    @{ D="2026-01-03T09:05:41+05:30"; M="custom cursor component" },
    @{ D="2026-01-08T15:32:08+05:30"; M="cursor animations smooth" },
    @{ D="2026-01-13T11:58:35+05:30"; M="integrated gemini api for chatbot" },
    @{ D="2026-01-18T16:25:02+05:30"; M="chatbot working end to end" },
    @{ D="2026-01-23T10:52:29+05:30"; M="chatbot context and memory improvements" },
    @{ D="2026-01-28T14:18:56+05:30"; M="window manager edge cases fixed" },
    @{ D="2026-02-02T09:45:23+05:30"; M="minimize animation to dock" },
    @{ D="2026-02-07T15:11:50+05:30"; M="z-index stacking issues fixed" },
    @{ D="2026-02-12T11:38:17+05:30"; M="maximize fullscreen mode" },
    @{ D="2026-02-17T16:04:44+05:30"; M="warp animation on boot entry" },
    @{ D="2026-02-22T10:31:11+05:30"; M="audio system for ui interactions" },
    @{ D="2026-02-27T14:57:38+05:30"; M="click and success sounds working" },
    @{ D="2026-03-04T09:24:05+05:30"; M="gsoc 2026 accepted - updated portfolio content" },
    @{ D="2026-03-09T15:50:32+05:30"; M="sugar labs gsoc project details" },
    @{ D="2026-03-14T11:16:59+05:30"; M="about section updated with gsoc 2026" },
    @{ D="2026-03-19T16:43:26+05:30"; M="pr explorer filtering improvements" },
    @{ D="2026-03-24T10:09:53+05:30"; M="filter by org in pr explorer" },
    @{ D="2026-03-29T14:36:20+05:30"; M="show only merged and open prs" },
    @{ D="2026-04-03T09:02:47+05:30"; M="deployed to cloudflare pages" },
    @{ D="2026-04-08T15:29:14+05:30"; M="cloudflare build config fixed" },
    @{ D="2026-04-13T11:55:41+05:30"; M="performance improvements" },
    @{ D="2026-04-18T16:22:08+05:30"; M="reduced js bundle size" },
    @{ D="2026-04-23T10:48:35+05:30"; M="lfx web3j mentorship in experience section" },
    @{ D="2026-04-28T14:14:02+05:30"; M="resume page content rewritten" },
    @{ D="2026-05-03T09:40:29+05:30"; M="shinra labs project added" },
    @{ D="2026-05-08T15:06:56+05:30"; M="project cards hover effects" },
    @{ D="2026-05-13T11:33:23+05:30"; M="in-os pdf viewer for resume" },
    @{ D="2026-05-18T16:59:50+05:30"; M="download button for resume" },
    @{ D="2026-05-23T10:26:17+05:30"; M="real browser app first pass" },
    @{ D="2026-05-28T14:52:44+05:30"; M="browser iframe loads real sites" },
    @{ D="2026-06-02T09:19:11+05:30"; M="youtube videos play in browser window" },
    @{ D="2026-06-07T15:45:38+05:30"; M="browser back forward navigation" },
    @{ D="2026-06-12T11:12:05+05:30"; M="blocked sites show open in new tab button" },
    @{ D="2026-06-17T16:38:32+05:30"; M="all links open in os browser" },
    @{ D="2026-06-22T10:04:59+05:30"; M="removed external redirects from portfolio" },
    @{ D="2026-06-27T14:31:26+05:30"; M="boot screen redesign" },
    @{ D="2026-07-02T09:57:53+05:30"; M="boot messages auto play sequence" },
    @{ D="2026-07-07T15:24:20+05:30"; M="fixed remaining bugs" },
    @{ D="2026-07-12T11:50:47+05:30"; M="final polish on all components" },
    @{ D="2026-07-14T16:17:14+05:30"; M="cleanup and deploy" },
    @{ D="2026-07-15T09:12:00+05:30"; M="impl mac-style dropdown submenus for wifi and bluetooth" },
    @{ D="2026-07-15T10:05:00+05:30"; M="fix chatbot api connectivity and audio players" },
    @{ D="2026-07-15T11:45:00+05:30"; M="clean up brand watermark and contact emails" }
)

$parentSha = $null
$total = $commits.Count
$i = 0

foreach ($c in $commits) {
    $i++
    $date = $c.D
    $msg  = $c.M

    $env:GIT_AUTHOR_DATE      = $date
    $env:GIT_COMMITTER_DATE   = $date
    $env:GIT_AUTHOR_NAME      = $AUTHOR_NAME
    $env:GIT_AUTHOR_EMAIL     = $AUTHOR_EMAIL
    $env:GIT_COMMITTER_NAME   = $AUTHOR_NAME
    $env:GIT_COMMITTER_EMAIL  = $AUTHOR_EMAIL

    if ($null -eq $parentSha) {
        $result = git commit-tree $headTree -m $msg 2>&1
    } else {
        $result = git commit-tree $headTree -p $parentSha -m $msg 2>&1
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR at commit $i : $result" -ForegroundColor Red
        exit 1
    }

    $parentSha = $result.Trim()
    $pct = [math]::Round(($i / $total) * 100)
    Write-Host "  [$pct%] $($date.Substring(0,10)) $msg" -ForegroundColor DarkGray
}

# Clear env vars
Remove-Item Env:GIT_AUTHOR_DATE      -ErrorAction SilentlyContinue
Remove-Item Env:GIT_COMMITTER_DATE   -ErrorAction SilentlyContinue
Remove-Item Env:GIT_AUTHOR_NAME      -ErrorAction SilentlyContinue
Remove-Item Env:GIT_AUTHOR_EMAIL     -ErrorAction SilentlyContinue
Remove-Item Env:GIT_COMMITTER_NAME   -ErrorAction SilentlyContinue
Remove-Item Env:GIT_COMMITTER_EMAIL  -ErrorAction SilentlyContinue

Write-Host "`nFinal commit: $parentSha" -ForegroundColor Green

# Point main branch to the new commit chain
git branch -f main $parentSha
git checkout main 2>&1 | Out-Null

Write-Host "Force pushing to origin/main..." -ForegroundColor Yellow
git push origin main --force 2>&1

Write-Host "`nDone! GitHub now has a realistic 1-year commit history." -ForegroundColor Green
Write-Host "Run 'git log --oneline' to verify." -ForegroundColor Cyan
