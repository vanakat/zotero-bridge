import esbuild from "esbuild";
import process from "process";
import builtins from 'builtin-modules'

const prod = (process.argv[2] === 'production');
const args = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    external: [
        'obsidian',
        'electron',
        '@codemirror/autocomplete',
        '@codemirror/closebrackets',
        '@codemirror/collab',
        '@codemirror/commands',
        '@codemirror/comment',
        '@codemirror/fold',
        '@codemirror/gutter',
        '@codemirror/highlight',
        '@codemirror/history',
        '@codemirror/language',
        '@codemirror/lint',
        '@codemirror/matchbrackets',
        '@codemirror/panel',
        '@codemirror/rangeset',
        '@codemirror/rectangular-selection',
        '@codemirror/search',
        '@codemirror/state',
        '@codemirror/stream-parser',
        '@codemirror/text',
        '@codemirror/tooltip',
        '@codemirror/view',
        ...builtins],
    format: 'cjs',
    target: 'es2016',
    logLevel: "info",
    sourcemap: false,
    treeShaking: true,
    outfile: 'main.js',
}

if (!prod) {
    args.sourcemap = 'inline';
    await (await esbuild.context(args)).watch()
} else {
    await esbuild.build(args);
}
