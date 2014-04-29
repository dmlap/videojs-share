'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> Brightcove;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['build', 'dist', 'tmp']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        nonull: true
      },
      dist: {
        src: ['src/videojs-share.js'],
        dest: 'dist/videojs.share.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/videojs.share.min.js'
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    connect: {
      dev: {
        options: {
          port: 9999,
          keepalive: true
        }
      }
    },
    open : {
      dev : {
        path: 'http://127.0.0.1:<%= connect.dev.options.port %>/example.html',
        app: 'Google Chrome'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      }
    },
    mxmlc: {
      options: {
        metadata: {
          title: 'VideoJS SWF',
          description: 'http://www.videojs.com',
          publisher: 'Brightcove, Inc.',
          creator: 'Brightcove, Inc.',
          language: 'EN',
          localizedTitle: null,
          localizedDescription: null,
          contributor: null,
          date: null
        },

        application: {
          layoutSize: {
            width: 640,
            height: 360
          },
          frameRate: 30,
          backgroundColor: 0x000000,
          scriptLimits: {
            maxRecursionDepth: 1000,
            maxExecutionTime: 60
          }
        },

        libraries: ['libs/*.*'],
        compiler: {
          'accessible': false,
          'actionscriptFileEncoding': null,
          'allowSourcePathOverlap': false,
          'as3': true,
          'benchmark': true,
          'contextRoot': null,
          'debug': false,
          'defaultsCssFiles': [],
          'defaultsCssUrl': null,
          'defines': {},
          'es': false,
          'externs': [],
          'externalLibraries': [],
          'fonts': {
            advancedAntiAliasing: false,
            languages: [],
            localFontsSnapshot: null,
            managers: []
          },
          'incremental': false
        }
      },
      clipboard: {
        files: {
          'src/swf/clipboard.swf': ['src/swf/ClipboardAPI.as']
        }
      }
    },
    concurrent: {
      dev: {
        tasks: ['connect', 'open', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerMultiTask('mxmlc', 'Compiling SWF', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var childProcess = require('child_process');
    var flexSdk = require('flex-sdk');
    var async = require('async');
    var pkg =  grunt.file.readJSON('package.json');

    var done = this.async(),
        maxConcurrency = 1,
        q,
        workerFn;

    workerFn = function(f, callback) {
      // Concat specified files.
      var srcList = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return false;
        }
        else {
          return true;
        }
      });

      var cmdLineOpts = [];

      if (f.dest) {
        cmdLineOpts.push('-output');
        cmdLineOpts.push(f.dest);
      }

      cmdLineOpts.push('-define=CONFIG::version, "' + pkg.version + '"');
      cmdLineOpts.push('--');
      cmdLineOpts.push.apply(cmdLineOpts, srcList);

      grunt.verbose.writeln('package version: ' + pkg.version);
      grunt.verbose.writeln('mxmlc path: ' + flexSdk.bin.mxmlc);
      grunt.verbose.writeln('options: ' + JSON.stringify(cmdLineOpts));

      // Compile!
      childProcess(flexSdk.bin.mxmlc,
                   cmdLineOpts,
                   function(err) {
        if (err) {
          grunt.warn(err);
        }
        grunt.log.writeln('File "' + f.dest + '" created.');
        callback(err);
      });
    };

    q = async.queue(workerFn, maxConcurrency);
    q.drain = done;
    q.push(this.files);
  });

  // Launch a Development Environment
  grunt.registerTask('dev', 'Launching Dev Environment', 'concurrent:dev');

  // Default task.
  grunt.registerTask('default',
                     ['clean',
                      'jshint',
                      'mxmlc',
                      'qunit',
                      'concat',
                      'uglify']);

};
