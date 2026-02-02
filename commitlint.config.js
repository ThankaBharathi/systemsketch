module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of these
    'type-enum': [
      2,  // 2 = error
      'always',
      [
        'feat',     // ✨ New feature
        'fix',      // 🐛 Bug fix
        'docs',     // 📝 Documentation
        'style',    // 💄 Formatting (no code change)
        'refactor', // ♻️ Code restructuring
        'perf',     // ⚡ Performance improvement
        'test',     // ✅ Adding tests
        'build',    // 📦 Build system changes
        'ci',       // 👷 CI configuration
        'chore',    // 🔧 Maintenance
        'revert',   // ⏪ Revert commit
      ],
    ],

    // Type must be lowercase
    'type-case': [2, 'always', 'lower-case'],

    // Subject must be lowercase
    'subject-case': [2, 'always', 'lower-case'],

    // No period at end of subject
    'subject-full-stop': [2, 'never', '.'],

    // Max 72 characters for subject
    'subject-max-length': [2, 'always', 72],

    // Max 100 characters per line in body
    'body-max-line-length': [2, 'always', 100],
  },
};