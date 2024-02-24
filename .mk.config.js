declare({
  name: 'link',
  as: shell({
    bin: 'npm',
    flags: ['link', 'gs-testing', 'gs-types', 'devbase', 'moirai', 'nabu'],
  }),
});

declare({
  name: 'commit',
  as: serial({
    cmds: [
      shell({bin: 'eslint', flags: ['**/*.ts']}),
      shell({bin: 'git', flags: ['commit', '-a']}),
    ],
  }),
});