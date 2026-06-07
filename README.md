# MAEVE // OSCP Quest Tracker

> *"these violent delights have violent ends."*

MAEVE is a single-file, offline-first OSCP prep companion. No server, no accounts, no internet required. Just open `index.html` in a browser and start hacking.

---

## Getting Started

```
git clone <this repo>
open oscp-quest/index.html   # or just double-click it
```

That's it. All your data is saved automatically in your browser's `localStorage`. Nothing leaves your machine unless you export it.

---

## Features at a Glance

| Tab | What it does |
|---|---|
| **Machines** | Track every OSCP-relevant box from HTB and PG |
| **Skill Map** | See your technique coverage at a glance |
| **Cheatsheet** | Your living command reference, markdown-powered |
| **AD Lab** | Active Directory attack chain checklist |
| **Timer** | Pomodoro-style focus sessions with session log |
| **Settings** | Name, exam date, theme |

---

## Machines Tab

This is home base. 160 machines relevant to OSCP prep is preloaded, currently from HackTheBox and Proving Grounds from OffSec exclusively, with platform, OS, difficulty, and technique tags.

### Status Cycle

Click the colored dot on any machine to advance its status:

```
TODO  →  IN PROGRESS  →  ROOTED  →  (back to TODO)
```

Hit **✗ stuck** when you're in progress but hit a wall. This opens a **stuck note** field so you can write down what you tried and what you still need to learn, great for revisiting the box later.

### Notes & Writeups

Click **notes ▼** to expand a machine's note panel. Inside you get:

- **Writeup URL**: paste a link to an external writeup for reference
- **Upload .md**: upload a local markdown file directly into notes
- **Notes area**: freeform markdown notes: findings, credentials, commands, next steps
- **Preview mode**: rendered markdown view of your notes

Notes are auto-saved as you type.

### Tags

Tags are spoilered by default (shown as `[ hidden ]`) until a box is rooted or stuck, so you're not accidentally primed on the technique before you've tried it.

### Mastery

Root a box a second time and it becomes **MASTERED**, tracked separately in stats and worth bonus XP.

### Filters & Search

Use the filter bar to slice by platform (HTB/PG), OS, difficulty, or status. The search box filters by machine name and tags in real time.

### Custom Machines

Click **+ add machine** to add machines from other platforms (TryHackMe, your own lab, etc.). Custom machines support all the same features as built-in ones.

### The Spin Button 🎲

Can't decide what to hack next? Hit **spin**: MAEVE will randomly pick an un-rooted machine from your list. After the reel stops, click **go to machine** and it will:
- Switch to the Machines tab
- Scroll the box into view
- Highlight it with a purple pulse
- Auto-open its notes panel

---

## XP & Levels

Every rooted machine earns you XP. The XP bar at the top tracks your progress to the next level.

| Difficulty | Base XP |
|---|---|
| Easy | 100 XP |
| Medium | 200 XP |
| Hard | 350 XP |

**Bonuses:**
- **+75 XP** for Active Directory machines
- **+50 XP** for mastering a box (root it twice)
- **+30 XP** per AD Lab technique checked off

**Levels:**

| XP | Rank |
|---|---|
| 0 | NOOB |
| 300 | SCRIPT KIDDIE |
| 900 | HACKER |
| 2,500 | SR. HACKER |
| 5,500 | ELITE |
| 9,000 | OSCP READY |

---

## Skill Map Tab

Automatically built from your rooted boxes. Shows how many boxes you've completed for each technique category so you can spot gaps in your coverage before the exam.

Categories tracked:
- **Enumeration**: SMB, DNS, SNMP
- **Web & Initial Access**: SQLi, LFI/RFI, file upload, CMS exploits, RCE
- **Linux PrivEsc**: SUID, cron, sudo
- **Windows PrivEsc**: token impersonation, buffer overflow, service exploits, registry
- **Active Directory**: Kerberoasting, AS-REP, DCSync, ADCS, LAPS, NTLM relay, ACL abuse, and more

---

## Cheatsheet Tab

A personal command reference that lives with your tracker. Each entry has a title, tags, and a markdown content area. Built-in entries cover common OSCP techniques; add your own freely.

- **Filter by tag**: find what you need fast
- **Edit / Preview toggle**: write in raw markdown, read it rendered
- **Export .md**: download your full cheatsheet as a single markdown file

---

## AD Lab Tab

A checklist of the 13 core Active Directory attack techniques you need for OSCP, each with a description and real commands (using impacket, netexec, certipy, BloodHound, etc.).

Check off techniques as you practice them. Completing techniques earns XP and is tracked in your stats. Click any technique to expand its command block.

You can also add your own custom AD techniques with the **+ add technique** button.

---

## Timer Tab

A Pomodoro timer for focused hacking sessions.

- Configurable work / short break / long break durations
- Assign a session to a specific machine ("working on: ...")
- Session log tracks all your completed sessions with timestamps
- Stats for today's session count and total focused hours

Sessions count toward your daily streak in the exam countdown widget.

---

## Exam Countdown

Set your exam goal date in Settings and the countdown widget shows:
- Days remaining (weeks + days)
- Boxes rooted this week
- Current daily streak
- Your vibe rating: **CRUSHING IT**, **SOLID PACE**, **TIME TO GRIND**, etc.
- Required pace (boxes/week) to finish in time

---

## Global Search

Click **⌕ search** in the toolbar to search across everything at once: machine names, your notes, cheatsheet entries, and AD lab techniques. Results jump directly to the matching item.

---

## Data & Backup

Everything is saved in `localStorage` automatically. To back up or move your data:

- **Export JSON**: downloads a full backup file
- **Import JSON**: restores from a backup (merges settings, overwrites data)

> Back up before clearing your browser data, `localStorage` is wiped with browser history.

---

## Themes

Six themes available in Settings (click a color swatch to switch):

| Theme | Vibe |
|---|---|
| Pastel | Soft purple, the default |
| Dark | Deep dark with neon accents |
| Hacker | Terminal green on black |
| Synthwave | Retrowave pink and blue |
| Ocean | Cool teal and navy |
| Sakura | Warm pink and rose |

---

## Bonus: Tool Setup Script

Before you start grinding boxes, you need your toolkit ready. This script sets up a clean `~/tools/` directory with everything you'll reach for during OSCP — downloaded, unpacked, and permissions set.

**What it installs:**

| Category | Tools |
|---|---|
| Windows Enumeration & PrivEsc | winPEAS, PrivescCheck, PowerUp |
| Token-Based PrivEsc | GodPotato, PrintSpoofer, SigmaPotato |
| Lateral Movement & AD | Mimikatz, LaZagne, RunasCs, PowerView, SharpHound |
| Tunneling | Chisel (Windows + Linux) |
| Linux | linPEAS, pspy |
| Utilities | Netcat, EnableAllTokenPrivs, Get-SPN, SeBackupPrivilege |
| Kali Packages (apt/pip) | netexec, wesNG |

Existing tools are skipped by default. Pass `--force` to re-download everything.

### Install

```bash
# option A: download and run directly
curl -sSL https://gist.github.com/mev0lent/3a88de2b971dae0f5f34ae40e5493d04/raw | bash

# option B: inspect first (better habit)
curl -o setup_tools.sh https://gist.github.com/mev0lent/3a88de2b971dae0f5f34ae40e5493d04/raw
cat setup_tools.sh
bash setup_tools.sh
```

### Keep it updated

The script lives in a GitHub Gist, which is a git repo under the hood. Clone it once and `git pull` whenever the Gist changes:

```bash
# clone once
git clone https://gist.github.com/3a88de2b971dae0f5f34ae40e5493d04.git ~/tools/setup

# update after editing the Gist on GitHub
cd ~/tools/setup && git pull

# re-run to pick up new tools
bash ~/tools/setup/setup_tools.sh
```

---

## Tips

- **Route your prep**: filter by difficulty `Easy`, knock out todo boxes, then bump to `Medium`
- **Use the skill map**: if a category is low, filter by that tag and prioritize those boxes
- **Stuck ≠ failure**: the stuck note is your study guide; write what you missed, study it, retry
- **Mastery mode**: after your first run-through, go back and root boxes without writeups. Second root = mastered
- **Cheatsheet is yours**: delete the defaults you don't use, add commands that actually work for you
- **Spin when paralyzed**: decision fatigue is real; let MAEVE pick for you

---

*Built by Niklas Heringer as a personal OSCP prep tool. No tracking, no telemetry, no cloud. Just you and the boxes.*
