import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execAsync = util.promisify(exec);

export interface GitSyncResult {
  success: boolean;
  pushed: boolean;
  commitHash?: string;
  message: string;
  details?: string;
}

/**
 * Automates committing and pushing cms-data.json changes to GitHub origin/main.
 */
export async function commitAndPushCmsData(customMessage?: string): Promise<GitSyncResult> {
  const rootDir = process.cwd();
  const targetFile = 'cms-data.json';

  try {
    // 1. Check if cms-data.json has changes
    const { stdout: statusOut } = await execAsync(`git status --porcelain ${targetFile}`, {
      cwd: rootDir,
      timeout: 10000,
    });

    if (!statusOut || !statusOut.trim()) {
      // No changes to commit, but check latest commit hash
      const { stdout: hashOut } = await execAsync('git rev-parse --short HEAD', {
        cwd: rootDir,
        timeout: 5000,
      }).catch(() => ({ stdout: '' }));

      return {
        success: true,
        pushed: false,
        commitHash: hashOut.trim() || undefined,
        message: 'No changes detected in cms-data.json to commit.',
      };
    }

    // 2. Stage the CMS data file
    await execAsync(`git add ${targetFile}`, { cwd: rootDir, timeout: 10000 });

    // 3. Commit with timestamp
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const commitMsg = customMessage || `chore(cms): auto-publish live updates [${timestamp}]`;
    await execAsync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, {
      cwd: rootDir,
      timeout: 10000,
    });

    // 4. Get the created commit hash
    const { stdout: hashOut } = await execAsync('git rev-parse --short HEAD', {
      cwd: rootDir,
      timeout: 5000,
    });
    const commitHash = hashOut.trim();

    // 5. Push to remote origin main
    const { stdout: pushOut, stderr: pushErr } = await execAsync('git push origin main', {
      cwd: rootDir,
      timeout: 30000,
    });

    return {
      success: true,
      pushed: true,
      commitHash,
      message: `Successfully committed and pushed to GitHub (${commitHash})!`,
      details: pushOut || pushErr || undefined,
    };
  } catch (error: any) {
    console.error('[Git Auto-Publish Error]:', error);
    return {
      success: false,
      pushed: false,
      message: error?.message || 'Failed to push changes to GitHub.',
      details: error?.stderr || error?.stdout || undefined,
    };
  }
}
