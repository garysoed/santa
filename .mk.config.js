declare({
  name: 'link',
  as: single({
    bin: 'npm',
    flags: ['link', 'gs-testing', 'gs-types', 'dev', 'devbase', 'moirai', 'nabu'],
  }),
});

declare({
  name: 'commit',
  as: serial({
    cmds: [
      single({bin: 'eslint', flags: ['**/*.ts']}),
      single({bin: 'git', flags: ['commit', '-a']}),
    ],
  }),
});