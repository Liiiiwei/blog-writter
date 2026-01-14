import { spawn } from 'child_process';

const start = (command, args, name) => {
    const proc = spawn(command, args, { shell: true, stdio: 'inherit' });
    proc.on('close', (code) => console.log(`${name} exited with code ${code}`));
    return proc;
};

console.log('🚀 正在啟動立崴 SEO 寫手助理...');
start('npx', ['tsx', '--watch', 'server/index.ts'], 'Backend');
start('npx', ['vite', '--open'], 'Frontend');
