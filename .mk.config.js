load('node_modules/devbase/.mk.config-base.js');
load('node_modules/devbase/ts/.mk.config-base.js');

set_vars({
  vars: {
    local_deps: ['gs-testing', 'gs-types', 'devbase', 'moirai', 'nabu'],
    srcs: ['export/*.ts', 'src/**/*.ts'],
  },
});

declare({
  name: 'commit',
  as: serial({
    cmds: [
      shell({bin: 'eslint', flags: ['**/*.ts']}),
      shell({bin: 'prettier', flags: ['.', '-w']}),
      shell({bin: 'git', flags: ['add', '.']}),
      shell({bin: 'git', flags: ['commit', '-a']}),
    ],
  }),
});
