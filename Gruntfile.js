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
        stripBanners: true
      },
      dist: {
        nonull: true,
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
      files: ['test/**/*.html', '!test/perf.html', '!test/muxer/**']
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
        src: ['test/**/*.js',
              '!test/tsSegment.js',
              '!test/fixtures/*.js',
              '!test/manifest/**',
              '!test/muxer/**']
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
        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_16.html
        metadata: {
          // `-title "Adobe Flex Application"`
          title: 'VideoJS SWF',
          // `-description "http://www.adobe.com/flex"`
          description: 'http://www.videojs.com',
          // `-publisher "The Publisher"`
          publisher: 'Brightcove, Inc.',
          // `-creator "The Author"`
          creator: 'Brightcove, Inc.',
          // `-language=EN`
          // `-language+=klingon`
          language: 'EN',
          // `-localized-title "The Color" en-us -localized-title "The Colour" en-ca`
          localizedTitle: null,
          // `-localized-description "Standardized Color" en-us -localized-description "Standardised Colour" en-ca`
          localizedDescription: null,
          // `-contributor "Contributor #1" -contributor "Contributor #2"`
          contributor: null,
          // `-date "Mar 10, 2013"`
          date: null
        },

        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_18.html
        application: {
          // `-default-size 240 240`
          layoutSize: {
            width: 640,
            height: 360
          },
          // `-default-frame-rate=24`
          frameRate: 30,
          // `-default-background-color=0x869CA7`
          backgroundColor: 0x000000,
          // `-default-script-limits 1000 60`
          scriptLimits: {
            maxRecursionDepth: 1000,
            maxExecutionTime: 60
          }
        },

        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_19.html
        // `-library-path+=libraryPath1 -library-path+=libraryPath2`
        libraries: ['libs/*.*'],
        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_14.html
        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_17.html
        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_20.html
        // http://livedocs.adobe.com/flex/3/html/help.html?content=compilers_21.html
        compiler: {
          // `-accessible=false`
          'accessible': false,
          // `-actionscript-file-encoding=UTF-8`
          'actionscriptFileEncoding': null,
          // `-allow-source-path-overlap=false`
          'allowSourcePathOverlap': false,
          // `-as3=true`
          'as3': true,
          // `-benchmark=true`
          'benchmark': true,
          // `-context-root context-path`
          'contextRoot': null,
          // `-debug=false`
          'debug': false,
          // `-defaults-css-files filePath1 ...`
          'defaultsCssFiles': [],
          // `-defaults-css-url http://example.com/main.css`
          'defaultsCssUrl': null,
          // `-define=CONFIG::debugging,true -define=CONFIG::release,false`
          // `-define+=CONFIG::bool2,false -define+=CONFIG::and1,"CONFIG::bool2 && false"
          // `-define+=NAMES::Company,"'Adobe Systems'"`
          'defines': {},
          // `-es=true -as3=false`
          'es': false,
          // `-externs className1 ...`
          'externs': [],
          // `-external-library-path+=pathElement`
          'externalLibraries': [],
          'fonts': {
            // `-fonts.advanced-anti-aliasing=false`
            advancedAntiAliasing: false,
            // `-fonts.languages.language-range "Alpha and Plus" "U+0041-U+007F,U+002B"`
            // USAGE:
            // ```
            // languages: [{
            //   lang: 'Alpha and Plus',
            //   range: ['U+0041-U+007F', 'U+002B']
            // }]
            // ```
            languages: [],
            // `-fonts.local-fonts-snapsnot filePath`
            localFontsSnapshot: null,
            // `-fonts.managers flash.fonts.JREFontManager flash.fonts.BatikFontManager flash.fonts.AFEFontManager`
            // NOTE: FontManager preference is in REVERSE order (prefers LAST array item).
            //       For more info, see http://livedocs.adobe.com/flex/3/html/help.html?content=fonts_06.html
            managers: []
          },
          // `-incremental=false`
          'incremental': false
        }
      },
      videojs_swf: {
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

    var
        options = this.options,
        done = this.async(),
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
      childProcess.execFile(flexSdk.bin.mxmlc, cmdLineOpts, function(err, stdout, stderr) {
        if (!err) {
          grunt.log.writeln('File "' + f.dest + '" created.');
        }
        else {
          grunt.log.error(err.toString());
          grunt.verbose.writeln('stdout: ' + stdout);
          grunt.verbose.writeln('stderr: ' + stderr);

          if (options.force === true) {
            grunt.log.warn('Should have failed but will continue because this task had the `force` option set to `true`.');
          }
          else {
            grunt.fail.warn('FAILED');
          }

        }
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
                      'manifests-to-js',
                      'qunit',
                      'concat',
                      'uglify']);

};
