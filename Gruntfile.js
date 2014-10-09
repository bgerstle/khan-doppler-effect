'use strict';
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: 'test/**/*.spec.js'
      }
    },
    jshint: {
      // define the files to lint
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
    }
  });

  // skipping jshint since Khan Academy has so many globals
  grunt.registerTask('test', [/*'jshint',*/ 'jasmine']);
};
