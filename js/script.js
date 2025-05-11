// Matrix Rain Effect
function startMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 18;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%&@';

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = fontSize + 'px Courier New, monospace';
        ctx.fillStyle = '#00ff00';
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);

    setInterval(draw, 50);
}

startMatrixRain();

document.addEventListener('DOMContentLoaded', () => {
    // Simulate system boot
    const loginScreen = document.getElementById('login-screen');
    const mainContent = document.getElementById('main-content');
    const loginProgress = document.querySelector('.login-progress');
    const loginMessage = document.querySelector('.login-message');

    // System stats elements
    const toolbarCpu = document.getElementById('toolbar-cpu');
    const toolbarRam = document.getElementById('toolbar-ram');
    const toolbarNet = document.getElementById('toolbar-net');

    // Clock element
    const clock = document.getElementById('toolbar-clock').querySelector('span');

    // Update clock
    function updateClock() {
        const now = new Date();
        const time = now.toLocaleTimeString();
        clock.textContent = time;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Boot sequence messages
    const bootMessages = [
        '[  0.000000] Booting Z-Steve Linux OS 2025.1 (x86_64)',
        '[  0.001000] GRUB version 2.12 loaded',
        '[  0.002315] Loading Linux kernel 6.6.12-zsteve-amd64 ...',
        '[  0.004728] Initial RAM disk: /boot/initrd.img-6.6.12-zsteve-amd64',
        '[  0.007123] Starting kernel ...',
        '[  0.308952] Initializing cgroup subsystems ...',
        '[  0.512006] systemd 256 (256.4-1) running as PID 1',
        '[  0.623115] Mounting /proc',
        '[  0.632129] Mounting /sys',
        '[  0.640715] Activating swap partition /dev/sda5',
        '[  0.812004] Starting udev kernel device manager',
        '[  1.001445] Detected network interface: eth0',
        '[  1.135643] Starting NetworkManager.service ...',
        '[  1.302001] Starting ssh.service ...',
        '[  1.462009] Starting lightdm.service (Display Manager) ...',
        '[  1.618883] Mounting /home',
        '[  1.719003] Enabling firewall rules (iptables)',
        '[  1.819028] Starting PostgreSQL Database Server',
        '[  2.004561] Initializing metasploit framework services ...',
        '[  2.201093] Custom startup script: /etc/rc.local executing',
        '[  2.349201] Running user session services ...',
        '[  2.501238] Login manager active at tty1',
        '[  2.600001] Z-Steve Linux OS 2025.1 ready.'
    ];

    let currentMessage = 0;
    const messageInterval = setInterval(() => {
        if (currentMessage < bootMessages.length) {
            loginMessage.textContent = bootMessages[currentMessage];
            currentMessage++;
        } else {
            clearInterval(messageInterval);
        }
    }, 200);

    // Simulate boot progress
    loginProgress.style.width = '100%';

    // Show main content after boot sequence
    setTimeout(() => {
        loginScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        mainContent.classList.add('visible');
        // Force a reflow to ensure the transition works
        void mainContent.offsetWidth;
    }, 5000);

    // Animate system stats
    function updateStats() {
        // CPU usage (random between 20-80%)
        const cpuValue = Math.floor(Math.random() * 60) + 20;
        toolbarCpu.textContent = `${cpuValue}%`;

        // RAM usage (random between 30-90%)
        const ramValue = Math.floor(Math.random() * 60) + 30;
        toolbarRam.textContent = `${ramValue}%`;

        // Network usage (random between 10-70%)
        const netValue = Math.floor(Math.random() * 60) + 10;
        toolbarNet.textContent = `${netValue}%`;
    }

    // Update stats every 3 seconds
    setInterval(updateStats, 3000);
    updateStats();

    // Add click handlers for toolbar icons
    document.querySelector('.start-menu').style.cursor = 'default'; // Remove clickability from Linux penguin

    // Add shutdown functionality
    document.querySelector('.power-button').addEventListener('click', () => {
        const shutdownOverlay = document.getElementById('shutdown-overlay');
        shutdownOverlay.classList.remove('hidden');
        shutdownOverlay.classList.add('visible');
        
        // After animation completes, show final message
        setTimeout(() => {
            const finalMessage = shutdownOverlay.querySelector('.shutdown-final-message');
            finalMessage.style.opacity = '1';
        }, 3000);
    });

    // Remove the old toolbar icon click handlers
    document.querySelectorAll('.toolbar-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            if (icon.title === 'Terminal') {
                terminalPopup.classList.add('visible');
            } else if (icon.title === 'Files') {
                createFileExplorer();
            } else if (icon.title === 'Text Editor') {
                createTextEditor();
            }
        });
    });

    // Terminal window functionality
    const terminalPopup = document.getElementById('terminal-popup');
    const terminalClose = document.querySelector('.terminal-close');
    const terminalHeader = terminalPopup.querySelector('.terminal-header');
    const terminalContent = terminalPopup.querySelector('.terminal-content');
    let commandHistory = [];
    let historyIndex = -1;
    let currentInput = '';

    // Create and add the initial command line
    function createCommandLine() {
        const line = document.createElement('div');
        line.className = 'command-line';
        line.innerHTML = `<span class="prompt">$</span><span class="input"></span><span class="cursor">_</span>`;
        terminalContent.appendChild(line);
        return line;
    }

    // Update the current command line
    function updateCommandLine() {
        const currentLine = terminalContent.querySelector('.command-line:last-child');
        if (currentLine) {
            const inputSpan = currentLine.querySelector('.input');
            inputSpan.textContent = currentInput;
        }
    }

    // Add command output to terminal
    function addToTerminal(text, isCommand = false) {
        // Remove the current command line
        const currentLine = terminalContent.querySelector('.command-line:last-child');
        if (currentLine) {
            terminalContent.removeChild(currentLine);
        }

        // Add the output as a separate line
        if (isCommand) {
            const cmdLine = document.createElement('div');
            cmdLine.className = 'output-line';
            cmdLine.innerHTML = `<span class="prompt">$</span> ${text}`;
            terminalContent.appendChild(cmdLine);
        } else if (text) {
            const outLine = document.createElement('div');
            outLine.className = 'output-line';
            outLine.textContent = text;
            terminalContent.appendChild(outLine);
        }

        // Add a new command line for input
        createCommandLine();

        // Scroll to bottom
        terminalContent.scrollTop = terminalContent.scrollHeight;
    }

    // Handle command input
    function handleCommand(input) {
        if (!input.trim()) return;
        
        addToTerminal(input, true);
        const output = processCommand(input);
        if (output) {
            addToTerminal(output);
        }
        commandHistory.push(input);
        historyIndex = commandHistory.length;
        currentInput = '';
        updateCommandLine();
    }

    // Initialize the terminal with a command line
    terminalContent.innerHTML = ''; // Clear any existing content
    createCommandLine();

    // Available commands
    const commands = {
        help: () => {
            return `Available commands:
help - Show this help message
about - Display information about me
skills - List my technical skills
projects - Open projects window
clear - Clear the terminal
matrix - Toggle matrix rain effect
neofetch - Display system information
echo [text] - Display text
date - Show current date and time
whoami - Show current user
exit - Close terminal`;
        },
        about: () => {
            return `Z-Steve Linux OS v2025.1
A creative portfolio website designed to showcase my skills and projects
in a unique, hacker-themed interface.

Type 'help' to see available commands.`;
        },
        skills: () => {
            return `Technical Skills:

[Web Development]
• Frontend: HTML5, CSS3, JavaScript (ES6+)
• Backend: Node.js, Express
• Tools: Git, Docker
• Best Practices: Responsive Design, Progressive Web Apps

[Cybersecurity]
• Penetration Testing and Ethical Hacking
• Vulnerability Assessment
• Network Security
• Web Application Security
• Cryptography
• Wireless Network Security
• Reverse Engineering
• Bug Bounty Hunting
• Operating Systems Hardening
• Secure Coding Practices
• Security Architecture Design
• Risk Assessment & Mitigation

[Penetration Testing]
• Network Penetration Testing
• Web Application Security Testing
• CTF Competitions

[Operating Systems]
• Linux (Ubuntu, Kali, CentOS)
• System Hardening
• Virtualization (VMware, VirtualBox)
• Container Technologies

[Programming Languages]
• JavaScript
  - Frontend Development
  - Node.js Backend
  - React Framework
  - Currently learning: backend development techniques

• Python
  - Scripting & Automation
  - Data Analysis
  - Currently learning: Machine Learning

• Dart/Flutter
  - Mobile App Development
  - Cross-platform Development
  - Currently learning: Advanced Flutter

• HTML/CSS
  - Responsive Design
  - Modern CSS Features

• SQL
  - Database Queries
  - Data Modeling

• Java

• C

[Web Security]
• OWASP Top 10
• Security Headers Implementation
• Input Validation
• Authentication & Authorization
• Session Management
• API Security

[Network Security]
• Firewall Configuration
• IDS/IPS Implementation
• VPN Setup & Management
• Network Monitoring
• Protocol Analysis
• Security Architecture

[Mobile Development]
• Android Development (Flutter, Dart)
• iOS Development (Flutter, Dart)
• Cross-platform Development`;
        },
        projects: () => {
            createFileExplorer();
            return 'Opening projects window...';
        },
        clear: () => {
            // Keep only the last command line
            const currentLine = terminalContent.querySelector('.command-line:last-child');
            terminalContent.innerHTML = '';
            if (currentLine) {
                terminalContent.appendChild(currentLine);
            } else {
                createCommandLine();
            }
            return '';
        },
        matrix: () => {
            const canvas = document.getElementById('matrix-canvas');
            if (canvas.style.display === 'none') {
                canvas.style.display = 'block';
                return 'Matrix rain effect enabled';
            } else {
                canvas.style.display = 'none';
                return 'Matrix rain effect disabled';
            }
        },
        neofetch: () => {
            return `Z-Steve Linux OS v2025.1
-------------------
OS: Z-Steve Linux 2025.1
Kernel: 6.6.12-zsteve-amd64
Shell: zsh 5.9
Terminal: xterm-256color
CPU: Intel i9-13900K
GPU: NVIDIA RTX 4090
Memory: 32GB DDR5
Storage: 2TB NVMe SSD
Theme: Hacker Green
Icons: Font Awesome 6.0
-------------------`;
        },
        echo: (args) => {
            return args.join(' ');
        },
        date: () => {
            return new Date().toLocaleString();
        },
        whoami: () => {
            return 'root';
        },
        exit: () => {
            terminalPopup.classList.remove('visible');
            return '';
        }
    };

    // Process command
    function processCommand(input) {
        const args = input.trim().split(' ');
        const command = args[0].toLowerCase();
        args.shift(); // Remove command from args

        if (commands[command]) {
            return commands[command](args);
        } else if (command === '') {
            return '';
        } else {
            return `Command not found: ${command}. Type 'help' for available commands.`;
        }
    }

    // Handle keyboard input for terminal
    document.addEventListener('keydown', (e) => {
        if (!terminalPopup.classList.contains('visible')) return;

        if (e.key === 'Enter') {
            handleCommand(currentInput);
        } else if (e.key === 'Backspace') {
            currentInput = currentInput.slice(0, -1);
            updateCommandLine();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                currentInput = commandHistory[historyIndex];
                updateCommandLine();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                currentInput = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                currentInput = '';
            }
            updateCommandLine();
        } else if (e.key.length === 1) {
            currentInput += e.key;
            updateCommandLine();
        }
    });

    // Open terminal when clicking the terminal icon
    document.querySelector('.toolbar-icon[title="Terminal"]').addEventListener('click', () => {
        terminalPopup.classList.remove('hidden');
        terminalPopup.classList.add('visible');
        // Reset position to center
        terminalPopup.style.top = '50%';
        terminalPopup.style.left = '50%';
        terminalPopup.style.transform = 'translate(-50%, -50%)';
    });

    // Terminal shortcut click handler
    document.getElementById('terminal-shortcut').addEventListener('click', function() {
        terminalPopup.classList.remove('hidden');
        terminalPopup.classList.add('visible');
        // Reset position to center
        terminalPopup.style.top = '50%';
        terminalPopup.style.left = '50%';
        terminalPopup.style.transform = 'translate(-50%, -50%)';
    });

    // Close terminal
    terminalClose.addEventListener('click', () => {
        terminalPopup.classList.remove('visible');
        terminalPopup.classList.add('hidden');
    });

    // Add window stacking functionality
    let windowStack = [];

    function bringToFront(window) {
        // Remove window from stack if it exists
        const index = windowStack.indexOf(window);
        if (index > -1) {
            windowStack.splice(index, 1);
        }
        // Add window to top of stack
        windowStack.push(window);
        // Update z-index of all windows
        windowStack.forEach((win, i) => {
            win.style.zIndex = 1000 + i;
        });
    }

    // Modify makeDraggable function to add click handler and initial z-index
    function makeDraggable(element, handle) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        // Set initial position
        element.style.position = 'fixed';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.width = '1000px'; // Set fixed width
        element.style.resize = 'none'; // Prevent resizing

        // Add to window stack and set initial z-index
        windowStack.push(element);
        element.style.zIndex = 1000 + windowStack.length - 1;

        // Add click handler to bring window to front
        element.addEventListener('mousedown', (e) => {
            if (e.target === element || element.contains(e.target)) {
                bringToFront(element);
            }
        });

        handle.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            if (e.target === handle || e.target.parentNode === handle) {
                isDragging = true;
                
                // Get the current position
                const rect = element.getBoundingClientRect();
                initialX = e.clientX - rect.left;
                initialY = e.clientY - rect.top;

                // Store original width
                const originalWidth = element.offsetWidth;
                element.style.width = `${originalWidth}px`;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                
                // Calculate new position
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                // Keep window within viewport bounds
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                
                currentX = Math.min(Math.max(0, currentX), maxX);
                currentY = Math.min(Math.max(40, currentY), maxY); // 40px to account for toolbar

                // Apply the new position
                element.style.left = `${currentX}px`;
                element.style.top = `${currentY}px`;
                element.style.transform = 'none';
            }
        }

        function dragEnd() {
            isDragging = false;
        }
    }

    // Main window close functionality
    document.getElementById('main-window-close').addEventListener('click', function() {
        document.getElementById('portfolio-window').style.display = 'none';
        document.getElementById('portfolio-shortcut-bottom').style.display = 'flex';
    });

    // Portfolio shortcut click handler
    document.getElementById('portfolio-shortcut-bottom').addEventListener('click', function() {
        document.getElementById('portfolio-window').style.display = 'flex';
        document.getElementById('portfolio-shortcut-bottom').style.display = 'none';
    });

    // Apply draggable functionality to windows
    const portfolioWindow = document.getElementById('portfolio-window');
    const portfolioHeader = portfolioWindow.querySelector('.window-header');
    makeDraggable(portfolioWindow, portfolioHeader);

    // Apply draggable functionality to terminal
    makeDraggable(terminalPopup, terminalHeader);

    // Skill Windows Management
    const skillWindows = new Map();
    const skillContents = {
        'web-dev': `Web Development Skills:
• Frontend: HTML5, CSS3, JavaScript (ES6+)
• Backend: Node.js, Express
• Tools: Git, Docker
• Best Practices: Responsive Design, Progressive Web Apps`,
        
        'cyber': `Cybersecurity Expertise:
• Penetration Testing and Ethical Hacking
• Vulnerability Assessment
• Network Security
• Web Application Security
• Cryptography
• Wireless Network Security
• Reverse Engineering
• Bug Bounty Hunting
• Operating Systems Hardening
• Secure Coding Practices
• Security Architecture Design
• Risk Assessment & Mitigation`,
        
        'pentest': `Penetration Testing Skills:
• Network Penetration Testing
• Web Application Security Testing
• CTF Competitions`,
        
        'os': `Operating Systems Knowledge:
• Linux (Ubuntu, Kali, CentOS)
• System Hardening
• Virtualization (VMware, VirtualBox)
• Container Technologies`,
        
        'prog': `Programming Languages:
• JavaScript
  - Frontend Development
  - Node.js Backend
  - React Framework
  - Currently learning: backend development techniques

• Python
  - Scripting & Automation
  - Data Analysis
  - Currently learning: Machine Learning

• Dart/Flutter
  - Mobile App Development
  - Cross-platform Development
  - Currently learning: Advanced Flutter

• HTML/CSS
  - Responsive Design
  - Modern CSS Features

• SQL
  - Database Queries
  - Data Modeling

• Java

• C`,
        
        'websec': `Web Application Security:
• OWASP Top 10
• Security Headers Implementation
• Input Validation
• Authentication & Authorization
• Session Management
• API Security`,
        
        'netsec': `Network Security:
• Firewall Configuration
• IDS/IPS Implementation
• VPN Setup & Management
• Network Monitoring
• Protocol Analysis
• Security Architecture`,
        
        'mobile': `Mobile Development:
• Android Development (Flutter, Dart)
• iOS Development (Flutter, Dart)
• Cross-platform Development`
    };

    // Create skill windows
    function createSkillWindow(skillId) {
        if (skillWindows.has(skillId)) {
            return skillWindows.get(skillId);
        }

        const window = document.createElement('div');
        window.className = 'skill-window';
        window.innerHTML = `
            <div class="window-header">
                <span class="window-title">${document.querySelector(`[data-skill="${skillId}"]`).textContent.trim()}</span>
                <span class="window-close">×</span>
            </div>
            <div class="window-content">${skillContents[skillId]}</div>
        `;

        // Make window draggable
        const header = window.querySelector('.window-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.window-close').addEventListener('click', () => {
            window.classList.remove('visible');
        });

        document.getElementById('skill-windows').appendChild(window);
        skillWindows.set(skillId, window);
        return window;
    }

    // Handle skill button clicks
    document.querySelectorAll('.skill-button').forEach(button => {
        button.addEventListener('click', () => {
            const skillId = button.dataset.skill;
            const window = createSkillWindow(skillId);
            
            // If window is already visible, do nothing
            if (window.classList.contains('visible')) {
                return;
            }

            // Hide all other windows
            skillWindows.forEach(w => w.classList.remove('visible'));
            
            // Show this window and center it
            window.classList.add('visible');
            window.style.top = '50%';
            window.style.left = '50%';
            window.style.transform = 'translate(-50%, -50%)';
        });
    });

    // Project buttons functionality
    document.querySelectorAll('.project-button').forEach(button => {
        button.addEventListener('click', () => {
            const buttonText = button.textContent.trim();
            if (buttonText === 'View on GitHub') {
                window.open('https://github.com/Z-steve/', '_blank');
            } else if (buttonText === 'View Projects') {
                createFileExplorer();
            }
        });
    });

    // Update the projects section HTML
    const projectsSection = document.querySelector('.content-section:nth-child(2)');
    if (projectsSection) {
        const projectButtons = projectsSection.querySelector('.project-buttons');
        if (projectButtons) {
            projectButtons.innerHTML = `
                <button class="project-button">
                    <i class="fas fa-folder-open"></i>
                    <span>Files</span>
                </button>
                <button class="project-button">
                    <i class="fab fa-github"></i>
                    <span>View on GitHub</span>
                </button>
            `;

            // Add event listeners for the buttons
            const buttons = projectButtons.querySelectorAll('.project-button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const buttonText = button.querySelector('span').textContent;
                    if (buttonText === 'View on GitHub') {
                        window.open('https://github.com/Z-steve/', '_blank');
                    } else if (buttonText === 'Files') {
                        createFileExplorer();
                    }
                });
            });
        }
    }

    // Security tool terminal windows
    const securityTools = {
        nmap: {
            title: 'Nmap Scanner',
            initialOutput: `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for target (192.168.1.1)
Host is up (0.00023s latency).
Not shown: 998 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https

Nmap done: 1 IP address (1 host up) scanned in 1.23 seconds`
        },
        metasploit: {
            title: 'Metasploit Framework',
            initialOutput: `[+] Starting Metasploit Framework...
[+] Loading modules...
[+] Database connected
[+] 1923 modules loaded
[+] Ready for exploitation

msf6 >`
        },
        aircrack: {
            title: 'Aircrack-ng',
            initialOutput: `Starting Aircrack-ng 1.7
Opening wlan0...
Found 3 networks:
1. Home_Network (WPA2)
2. Office_WiFi (WPA)
3. Guest_Access (Open)

Select target network:`
        },
        hydra: {
            title: 'Hydra Password Cracker',
            initialOutput: `Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak
Starting password cracking session...
Target: ssh://192.168.1.1
Username: admin
Password list: /usr/share/wordlists/rockyou.txt
Tasks: 16
Hydra ready.`
        }
    };

    // Add window tracking for nmap
    let nmapWindow = null;

    // Add click handlers for security tool shortcuts
    document.getElementById('nmap-shortcut').addEventListener('click', () => {
        // If window already exists and is visible, do nothing
        if (nmapWindow && nmapWindow.isConnected) {
            return;
        }

        // If window exists but was removed, create a new one
        if (nmapWindow && !nmapWindow.isConnected) {
            nmapWindow = null;
        }

        const window = document.createElement('div');
        window.className = 'terminal-popup hidden';
        window.style.display = 'flex';
        window.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">Nmap Scanner</span>
                <span class="terminal-close"><i class="fas fa-times"></i></span>
            </div>
            <div class="terminal-content">
                <div class="command-line">
                    <span class="prompt">$</span><span class="input">nmap -sV -sC -p- 192.168.1.0/24</span>
                </div>
            </div>
        `;

        document.body.appendChild(window);
        const header = window.querySelector('.terminal-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.terminal-close').addEventListener('click', () => {
            window.classList.remove('visible');
            window.classList.add('hidden');
            setTimeout(() => {
                window.remove();
                nmapWindow = null;
            }, 300); // Match the transition duration
        });

        const terminalContent = window.querySelector('.terminal-content');
        
        // Simulate nmap scan output
        const outputs = [
            'Starting Nmap 7.94 ( https://nmap.org )',
            'Nmap scan report for 192.168.1.1',
            'Host is up (0.0023s latency).',
            'Not shown: 65534 closed ports',
            'PORT     STATE SERVICE       VERSION',
            '22/tcp   open  ssh          OpenSSH 8.9p1 Ubuntu 3ubuntu0.1',
            '80/tcp   open  http         nginx 1.18.0',
            '443/tcp  open  ssl/https    nginx 1.18.0',
            '3306/tcp open  mysql        MySQL 8.0.32',
            'Service Info: Host: router.local; OS: Linux; CPE: cpe:/o:linux:linux_kernel',
            '',
            'Nmap scan report for 192.168.1.2',
            'Host is up (0.0015s latency).',
            'Not shown: 65533 closed ports',
            'PORT     STATE SERVICE       VERSION',
            '22/tcp   open  ssh          OpenSSH 9.0p1 Debian 2',
            '80/tcp   open  http         Apache httpd 2.4.57',
            'Service Info: Host: webserver.local; OS: Linux; CPE: cpe:/o:linux:linux_kernel',
            '',
            'Nmap scan report for 192.168.1.3',
            'Host is up (0.0021s latency).',
            'Not shown: 65534 closed ports',
            'PORT     STATE SERVICE       VERSION',
            '445/tcp  open  microsoft-ds Windows 10 Pro 19045',
            'Service Info: Host: DESKTOP-PC; OS: Windows; CPE: cpe:/o:microsoft:windows',
            '',
            'Nmap done: 256 IP addresses (3 hosts up) scanned in 45.32 seconds'
        ];

        // Add outputs with a slight delay
        outputs.forEach((output, index) => {
            setTimeout(() => {
                const outputLine = document.createElement('div');
                outputLine.className = 'output-line';
                outputLine.textContent = output;
                terminalContent.appendChild(outputLine);
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }, index * 200);
        });

        // Show window with animation
        requestAnimationFrame(() => {
            window.classList.remove('hidden');
            window.classList.add('visible');
        });

        nmapWindow = window;
    });

    // Add window tracking for metasploit
    let metasploitWindow = null;

    // Add click handlers for security tool shortcuts
    document.getElementById('metasploit-shortcut').addEventListener('click', () => {
        // If window already exists and is visible, do nothing
        if (metasploitWindow && metasploitWindow.isConnected) {
            return;
        }

        // If window exists but was removed, create a new one
        if (metasploitWindow && !metasploitWindow.isConnected) {
            metasploitWindow = null;
        }

        const window = document.createElement('div');
        window.className = 'terminal-popup hidden';
        window.style.display = 'flex';
        window.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">Metasploit Framework</span>
                <span class="terminal-close"><i class="fas fa-times"></i></span>
            </div>
            <div class="terminal-content">
                <div class="command-line">
                    <span class="prompt">msf6 ></span><span class="input">use exploit/multi/handler</span>
                </div>
            </div>
        `;

        document.body.appendChild(window);
        const header = window.querySelector('.terminal-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.terminal-close').addEventListener('click', () => {
            window.classList.remove('visible');
            window.classList.add('hidden');
            setTimeout(() => {
                window.remove();
                metasploitWindow = null;
            }, 300); // Match the transition duration
        });

        const terminalContent = window.querySelector('.terminal-content');
        
        // Simulate metasploit output
        const outputs = [
            '[*] Using configured payload generic/shell_reverse_tcp',
            '[*] Started reverse TCP handler on 192.168.1.100:4444',
            '',
            'msf6 exploit(multi/handler) > set PAYLOAD windows/meterpreter/reverse_tcp',
            'PAYLOAD => windows/meterpreter/reverse_tcp',
            '',
            'msf6 exploit(multi/handler) > set LHOST 192.168.1.100',
            'LHOST => 192.168.1.100',
            '',
            'msf6 exploit(multi/handler) > set LPORT 4444',
            'LPORT => 4444',
            '',
            'msf6 exploit(multi/handler) > exploit',
            '',
            '[*] Started reverse TCP handler on 192.168.1.100:4444',
            '[*] Sending stage (175686 bytes) to 192.168.1.50',
            '[*] Meterpreter session 1 opened (192.168.1.100:4444 -> 192.168.1.50:49152)',
            '',
            'meterpreter > sysinfo',
            'Computer        : DESKTOP-TARGET',
            'OS              : Windows 10 (10.0 Build 19045).',
            'Architecture    : x64',
            'System Language : en_US',
            'Domain          : WORKGROUP',
            'Logged On Users : 1',
            'Meterpreter     : x64/windows',
            '',
            'meterpreter > exit',
            '[*] Shutting down Meterpreter...',
            '',
            '[*] 192.168.1.50 - Meterpreter session 1 closed.',
            'msf6 exploit(multi/handler) > exit'
        ];

        // Add outputs with a slight delay
        outputs.forEach((output, index) => {
            setTimeout(() => {
                const outputLine = document.createElement('div');
                outputLine.className = 'output-line';
                outputLine.textContent = output;
                terminalContent.appendChild(outputLine);
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }, index * 200);
        });

        // Show window with animation
        requestAnimationFrame(() => {
            window.classList.remove('hidden');
            window.classList.add('visible');
        });

        metasploitWindow = window;
    });

    // Add window tracking for aircrack
    let aircrackWindow = null;

    document.getElementById('aircrack-shortcut').addEventListener('click', () => {
        // If window already exists and is visible, do nothing
        if (aircrackWindow && aircrackWindow.isConnected) {
            return;
        }

        // If window exists but was removed, create a new one
        if (aircrackWindow && !aircrackWindow.isConnected) {
            aircrackWindow = null;
        }

        const window = document.createElement('div');
        window.className = 'terminal-popup hidden';
        window.style.display = 'flex';
        window.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">Aircrack-ng</span>
                <span class="terminal-close"><i class="fas fa-times"></i></span>
            </div>
            <div class="terminal-content">
                <div class="command-line">
                    <span class="prompt">$</span><span class="input">sudo airodump-ng wlan0</span>
                </div>
            </div>
        `;

        document.body.appendChild(window);
        const header = window.querySelector('.terminal-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.terminal-close').addEventListener('click', () => {
            window.classList.remove('visible');
            window.classList.add('hidden');
            setTimeout(() => {
                window.remove();
                aircrackWindow = null;
            }, 300); // Match the transition duration
        });

        const terminalContent = window.querySelector('.terminal-content');
        
        // Simulate aircrack-ng output
        const outputs = [
            'CH 13 ][ Elapsed: 0 s ][ 2024-02-20 15:30',
            '',
            'BSSID              PWR  Beacons    #Data, #/s  CH  MB   ENC  CIPHER AUTH ESSID',
            '',
            '00:11:22:33:44:55  -45       12        0    0   6  130   WPA2 CCMP   PSK  Home_Network',
            'AA:BB:CC:DD:EE:FF  -52        8        0    0   1  130   WPA2 CCMP   PSK  Office_WiFi',
            '12:34:56:78:90:AB  -60        5        0    0  11  130   WPA2 CCMP   PSK  Guest_Access',
            '',
            'BSSID              STATION            PWR   Rate    Lost    Frames  Probe',
            '',
            '00:11:22:33:44:55  11:22:33:44:55:66  -45    0e- 0e     0       12',
            'AA:BB:CC:DD:EE:FF  22:33:44:55:66:77  -52    0e- 0e     0        8',
            '',
            '^C',
            '',
            'Aircrack-ng 1.7',
            '',
            'Reading packets, please wait...',
            '',
            'Opening wlan0',
            'Read 1234 packets.',
            '',
            '   #  BSSID              ESSID                     Encryption',
            '',
            '   1  00:11:22:33:44:55  Home_Network              WPA2 (1 handshake)',
            '   2  AA:BB:CC:DD:EE:FF  Office_WiFi              WPA2 (0 handshake)',
            '   3  12:34:56:78:90:AB  Guest_Access             WPA2 (0 handshake)',
            '',
            'Index number of target network ? 1',
            '',
            'Opening Home_Network-01.cap',
            'Reading packets, please wait...',
            '',
            'Aircrack-ng 1.7',
            '',
            '      [00:00:00] 0/1 keys tested (0.00 k/s)',
            '',
            '      Time left: --',
            '',
            '                           KEY FOUND! [ Home_Network ]',
            '',
            '      Master Key     : 12 34 56 78 90 AB CD EF 12 34 56 78 90 AB CD EF',
            '                       12 34 56 78 90 AB CD EF 12 34 56 78 90 AB CD EF',
            '',
            '      Transient Key  : 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
            '                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
            '                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
            '                       00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
            '',
            '      EAPOL HMAC     : 12 34 56 78 90 AB CD EF 12 34 56 78 90 AB CD EF',
            '',
            'Quitting aircrack-ng...'
        ];

        // Add outputs with a slight delay
        outputs.forEach((output, index) => {
            setTimeout(() => {
                const outputLine = document.createElement('div');
                outputLine.className = 'output-line';
                outputLine.textContent = output;
                terminalContent.appendChild(outputLine);
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }, index * 150); // Slightly faster than nmap/metasploit for better flow
        });

        // Show window with animation
        requestAnimationFrame(() => {
            window.classList.remove('hidden');
            window.classList.add('visible');
        });

        aircrackWindow = window;
    });

    // Add window tracking for hydra
    let hydraWindow = null;

    document.getElementById('hydra-shortcut').addEventListener('click', () => {
        // If window already exists and is visible, do nothing
        if (hydraWindow && hydraWindow.isConnected) {
            return;
        }

        // If window exists but was removed, create a new one
        if (hydraWindow && !hydraWindow.isConnected) {
            hydraWindow = null;
        }

        const window = document.createElement('div');
        window.className = 'terminal-popup hidden';
        window.style.display = 'flex';
        window.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">Hydra Password Cracker</span>
                <span class="terminal-close"><i class="fas fa-times"></i></span>
            </div>
            <div class="terminal-content">
                <div class="command-line">
                    <span class="prompt">$</span><span class="input">hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.1</span>
                </div>
            </div>
        `;

        document.body.appendChild(window);
        const header = window.querySelector('.terminal-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.terminal-close').addEventListener('click', () => {
            window.classList.remove('visible');
            window.classList.add('hidden');
            setTimeout(() => {
                window.remove();
                hydraWindow = null;
            }, 300); // Match the transition duration
        });

        const terminalContent = window.querySelector('.terminal-content');
        
        // Simulate hydra output
        const outputs = [
            'Hydra v9.4 (c) 2022 by van Hauser/THC & David Maciejak',
            '',
            'Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2024-02-20 15:35:00',
            '[DATA] max 16 tasks per 1 server, overall 16 tasks, 14344392 login tries (l:1/p:14344392), ~896525 tries per task',
            '[DATA] attacking ssh://192.168.1.1:22/',
            '',
            '[22][ssh] host: 192.168.1.1   login: admin   password: password123',
            '',
            '[STATUS] 16.00% (2295103/14344392) completed, elapsed time: 00:05:23',
            '[STATUS] 32.00% (4590206/14344392) completed, elapsed time: 00:10:45',
            '[STATUS] 48.00% (6885309/14344392) completed, elapsed time: 00:16:08',
            '[STATUS] 64.00% (9180412/14344392) completed, elapsed time: 00:21:30',
            '[STATUS] 80.00% (11475515/14344392) completed, elapsed time: 00:26:53',
            '[STATUS] 96.00% (13770618/14344392) completed, elapsed time: 00:32:15',
            '',
            '1 of 1 target successfully completed, 1 valid password found',
            'Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2024-02-20 16:07:15',
            '',
            'Results:',
            'SSH - 192.168.1.1:22',
            '  [22][ssh] host: 192.168.1.1   login: admin   password: password123',
            '',
            'Statistics:',
            '  Attempts: 14344392',
            '  Successful: 1',
            '  Failed: 14344391',
            '  Time: 32 minutes, 15 seconds',
            '  Speed: 7,421 attempts per second'
        ];

        // Add outputs with a slight delay
        outputs.forEach((output, index) => {
            setTimeout(() => {
                const outputLine = document.createElement('div');
                outputLine.className = 'output-line';
                outputLine.textContent = output;
                terminalContent.appendChild(outputLine);
                terminalContent.scrollTop = terminalContent.scrollHeight;
            }, index * 200);
        });

        // Show window with animation
        requestAnimationFrame(() => {
            window.classList.remove('hidden');
            window.classList.add('visible');
        });

        hydraWindow = window;
    });

    // Add click handler for files shortcut
    document.getElementById('files-shortcut').addEventListener('click', () => {
        createFileExplorer();
    });

    // Add window tracking
    let fileExplorerWindow = null;

    // Update the file explorer creation function
    function createFileExplorer() {
        // If window already exists and is visible, do nothing
        if (fileExplorerWindow && fileExplorerWindow.isConnected) {
            return;
        }

        // If window exists but was removed, create a new one
        if (fileExplorerWindow && !fileExplorerWindow.isConnected) {
            fileExplorerWindow = null;
        }

        const window = document.createElement('div');
        window.className = 'terminal-popup hidden';
        window.style.display = 'flex';
        window.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">File Explorer</span>
                <span class="terminal-close"><i class="fas fa-times"></i></span>
            </div>
            <div class="file-explorer-content">
                <div class="file-explorer-sidebar">
                    <div class="file-explorer-item active" data-folder="cybersecurity">
                        <i class="fas fa-shield-alt"></i>
                        <span>Cybersecurity</span>
                    </div>
                    <div class="file-explorer-item" data-folder="development">
                        <i class="fas fa-code"></i>
                        <span>Development</span>
                    </div>
                    <div class="file-explorer-item" data-folder="webdev">
                        <i class="fas fa-globe"></i>
                        <span>Web Dev</span>
                    </div>
                    <div class="file-explorer-item" data-folder="youtube">
                        <i class="fab fa-youtube"></i>
                        <span>YouTube</span>
                    </div>
                    <div class="file-explorer-item" data-folder="cumbo">
                        <i class="fas fa-gamepad"></i>
                        <span>Cumbo Games</span>
                    </div>
                </div>
                <div class="file-explorer-main">
                    <div class="folder-content" id="cybersecurity-content">
                        <h3>Cybersecurity</h3>
                        <div class="folder-section">
                            <h4>CTF Reports</h4>
                            <p>This section will be dedicated to my Capture The Flag (CTF) reports and writeups. As I participate in more CTF competitions, I'll document my solutions and learning experiences here.</p>
                            <div class="reports-list">
                                <div class="report-item">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Coming Soon: My First CTF Report</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="folder-content" id="development-content">
                        <h3>Development Projects</h3>
                        <div class="folder-section">
                            <h4>GitHub Repository</h4>
                            <p>Check out my development projects on GitHub:</p>
                            <div class="project-links">
                                <a href="https://github.com/Z-steve/" target="_blank" class="project-link">
                                    <i class="fab fa-github"></i> Visit GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="folder-content" id="webdev-content">
                        <h3>Web Development</h3>
                        <div class="folder-section">
                            <h4>Web Projects</h4>
                            <div class="projects-list">
                                <div class="project-item">
                                    <i class="fas fa-globe"></i>
                                    <span>Studio Cardiologico Demola - This website is for a cardiology clinic</span>
                                    <a href="https://studiocardiologicodemola.it" target="_blank" class="view-project-btn">
                                        <i class="fas fa-external-link-alt"></i> Visit Site
                                    </a>
                                </div>
                                <div class="project-item">
                                    <i class="fas fa-globe"></i>
                                    <span>La Dimora del Colle - This website is for a B&B, it will be soon alive</span>
                                    <a href="https://ladimoradelcolle.website" target="_blank" class="view-project-btn">
                                        <i class="fas fa-external-link-alt"></i> Visit Site
                                    </a>
                                </div>
                                <div class="project-item">
                                    <i class="fas fa-globe"></i>
                                    <span>Yet Another Password Wallet - This website is a password manager, a university project completed with a friend from my course of study</span>
                                    <a href="https://z-steve.github.io/yet-another-password-wallet/public/index.html" target="_blank" class="view-project-btn">
                                        <i class="fas fa-external-link-alt"></i> Visit Site
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="folder-content" id="youtube-content">
                        <h3>YouTube Channel</h3>
                        <div class="folder-section">
                            <h4>ZsteveAstra</h4>
                            <p>Welcome to my channel dedicated to Penetration Testing and Cybersecurity!</p>
                            <p>I share practical demos, techniques, and ethical hacking methodologies to identify vulnerabilities and improve digital security. As a passionate cybersecurity student, I'm here to provide valuable knowledge and connect with fellow enthusiasts. Subscribe, comment, and join our growing community as we explore the challenges and solutions of the digital world together.</p>
                            <div class="project-links">
                                <a href="https://www.youtube.com/@ZsteveAstra" target="_blank" class="project-link">
                                    <i class="fab fa-youtube"></i> Visit My YouTube Channel
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="folder-content" id="cumbo-content">
                        <h3>Cumbo Games</h3>
                        <div class="folder-section">
                            <h4>About the Project</h4>
                            <p>I'm the CEO of Cumbo Games, a small personal arcade game development company. These video games were developed for Android mobile devices. While this project is currently on hold, it represents an important part of my development journey.</p>
                            <p>I hope one day to have the time to develop some big video game projects for computers!</p>
                            <div class="project-links">
                                <a href="https://cumbo-games.wixsite.com/games-developers" target="_blank" class="project-link">
                                    <i class="fas fa-globe"></i> Visit Cumbo Games Website
                                </a>
                                <a href="https://apkpure.com/developer/Cumbo%20Games" target="_blank" class="project-link">
                                    <i class="fas fa-gamepad"></i> View Games on APKPure
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(window);
        const header = window.querySelector('.terminal-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.terminal-close').addEventListener('click', () => {
            window.classList.remove('visible');
            window.classList.add('hidden');
            setTimeout(() => {
                window.remove();
                fileExplorerWindow = null;
            }, 300); // Match the transition duration
        });

        // Folder click handlers
        window.querySelectorAll('.file-explorer-item').forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all items
                window.querySelectorAll('.file-explorer-item').forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                item.classList.add('active');
                
                const folderId = item.dataset.folder;
                window.querySelectorAll('.folder-content').forEach(content => {
                    content.style.display = 'none';
                });
                window.querySelector(`#${folderId}-content`).style.display = 'block';
            });
        });

        // Show window with animation
        requestAnimationFrame(() => {
            window.classList.remove('hidden');
            window.classList.add('visible');
        });

        fileExplorerWindow = window;
        return window;
    }

    // Text Editor Window
    function createTextEditor() {
        const window = document.createElement('div');
        window.className = 'terminal-popup';
        window.style.display = 'flex';
        window.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">Text Editor</span>
                <span class="terminal-close"><i class="fas fa-times"></i></span>
            </div>
            <div class="text-editor-content">
                <div class="text-editor-toolbar">
                    <button class="editor-button"><i class="fas fa-file"></i> New</button>
                    <button class="editor-button"><i class="fas fa-folder-open"></i> Open</button>
                    <button class="editor-button"><i class="fas fa-save"></i> Save</button>
                </div>
                <textarea class="text-editor-area" placeholder="Start typing..."></textarea>
            </div>
        `;

        document.body.appendChild(window);
        const header = window.querySelector('.terminal-header');
        makeDraggable(window, header);

        // Close button functionality
        window.querySelector('.terminal-close').addEventListener('click', () => {
            window.remove();
        });

        return window;
    }

    // Initialize carousels
    function initializeCarousels() {
        document.querySelectorAll('.carousel-container').forEach(container => {
            const track = container.querySelector('.carousel-track');
            const items = Array.from(container.querySelectorAll('.carousel-item'));
            const prevButton = container.querySelector('.carousel-button.prev');
            const nextButton = container.querySelector('.carousel-button.next');
            
            let currentIndex = 0;
            const totalItems = items.length;
            
            function updateCarousel() {
                items.forEach((item, index) => {
                    // Remove all classes first
                    item.classList.remove('active', 'prev', 'next', 'prev-2', 'next-2');
                    
                    // Calculate relative position
                    let position = index - currentIndex;
                    
                    // Handle wrapping
                    if (position < -2) position += totalItems;
                    if (position > 2) position -= totalItems;
                    
                    // Apply appropriate class based on position
                    if (position === 0) {
                        item.classList.add('active');
                    } else if (position === -1) {
                        item.classList.add('prev');
                    } else if (position === 1) {
                        item.classList.add('next');
                    } else if (position === -2) {
                        item.classList.add('prev-2');
                    } else if (position === 2) {
                        item.classList.add('next-2');
                    }
                });
                
                // Update button states
                prevButton.style.opacity = '1';
                nextButton.style.opacity = '1';
            }
            
            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                updateCarousel();
            });
            
            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalItems;
                updateCarousel();
            });

            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (container.closest('.visible')) {
                    if (e.key === 'ArrowLeft') {
                        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                        updateCarousel();
                    } else if (e.key === 'ArrowRight') {
                        currentIndex = (currentIndex + 1) % totalItems;
                        updateCarousel();
                    }
                }
            });

            // Add touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        // Swipe left
                        currentIndex = (currentIndex + 1) % totalItems;
                    } else {
                        // Swipe right
                        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                    }
                    updateCarousel();
                }
            }
            
            // Initial setup
            updateCarousel();
        });
    }

    // Call initializeCarousels after DOM content is loaded
    initializeCarousels();

    // Mobile shortcuts menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileShortcutsMenu = document.getElementById('mobile-shortcuts-menu');
    const mobileShortcutsClose = document.getElementById('mobile-shortcuts-close');

    if (mobileMenuBtn && mobileShortcutsMenu && mobileShortcutsClose) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileShortcutsMenu.style.display = 'flex';
        });
        mobileShortcutsClose.addEventListener('click', () => {
            mobileShortcutsMenu.style.display = 'none';
        });
        // Hide menu when clicking outside content
        mobileShortcutsMenu.addEventListener('click', (e) => {
            if (e.target === mobileShortcutsMenu) {
                mobileShortcutsMenu.style.display = 'none';
            }
        });
    }

    // Mobile shortcut actions
    const mobileShortcuts = [
        { id: 'mobile-terminal-shortcut', action: () => document.getElementById('terminal-shortcut').click() },
        { id: 'mobile-files-shortcut', action: () => document.getElementById('files-shortcut').click() },
        { id: 'mobile-nmap-shortcut', action: () => document.getElementById('nmap-shortcut').click() },
        { id: 'mobile-metasploit-shortcut', action: () => document.getElementById('metasploit-shortcut').click() },
        { id: 'mobile-aircrack-shortcut', action: () => document.getElementById('aircrack-shortcut').click() },
        { id: 'mobile-hydra-shortcut', action: () => document.getElementById('hydra-shortcut').click() },
    ];
    mobileShortcuts.forEach(({id, action}) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => {
                action();
                mobileShortcutsMenu.style.display = 'none';
            });
        }
    });
}); 