declare({
  name: 'link',
  as: single({
    bin: 'npm',
    flags: ['link', 'gs-testing', 'gs-types', 'dev', 'moirai', 'nabu'],
  }),
});