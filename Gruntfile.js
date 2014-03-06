module.exports = function(grunt) {


	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'build/assets/css/app.css': 'app/assets/sass/app.sass'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 version']
			},
			single_file: {
				src: 'build/assets/css/app.css',
				dest: 'build/assets/css/app.pf.css'
			}
		},

		cssmin: {
			combine: {
				files: {
					'build/assets/css/app.min.css': ['build/assets/css/app.pf.css']
				}
			}
		},

		jshint: {
			beforeconcat: ['build/assets/js/*.js']
		},

		concat: {
			dist: {
				src: [
					// Libs if you're lazy
					'app/assets/js/libs/*.js',
					'app/assets/js/app.js'
				],
				dest: 'build/assets/js/app.js'
			}

		},

		uglify: {
			dist: {
				src: [
					'build/assets/js/app.js'
				],
				dest: 'build/assets/js/app.min.js'
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'app/assets/images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'build/assets/images/'
				}]
			}
		},

		watch: {
			options: {
				spawn: true
			},
			scripts: {
				files: ['app/assets/js/*.js'],
				tasks: ['concat', 'uglify', 'jshint']
			},
			css: {
				files: ['app/assets/sass/**/*'],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			},
			images: {
				files: ['app/assets/images/**/*.{png,jpg,gif,svg}', 'app/assets/images/*.{png,jpg,gif,svg}'],
				tasks: ['imagemin', 'copy:svg']
			},
			html: {
				files: ['app/templates/**/*'],
				tasks: ['assemble']
			}
		},

		connect: {
			server: {
				options: {
					port: 9000,
					base: 'build/',
					open: true
				}
			}
		},

		assemble: {
			options: {
				flatten: true,
				layoutdir: 'app/templates/layouts',
				layout: 'layout.hbs',
				partials: 'app/templates/includes/*.hbs',
				assets: 'app/assets',
				production: 'pf'
			},
			pages: {
				files: {
					'build/': ['app/templates/pages/*.hbs' ]
				},
				options: {
					assets: 'build/assets'
				}
			}
		},

		copy: {
			humans: {
				src: 'app/humans.txt',
				dest: 'build/humans.txt',
			},
			
			humans: {
				src: 'app/robots.txt',
				dest: 'build/robots.txt',
			},

			favicon: {
				src: 'app/favicon.ico',
				dest: 'build/favicon.ico',
			},

			htaccess: {
				src: 'app/htaccess',
				dest: 'build/.htaccess',
			},

			fonts: {
				expand: true,
				flatten: true,
				src: ['app/assets/fonts/**'],
				dest: 'build/assets/fonts/',
				filter: 'isFile'
			},

			svg: {
				expand: true,
				flatten: true,
				src: ['app/assets/images/**.svg'],
				dest: 'build/assets/images/',
				filter: 'isFile'
			},
		},

		clean: {
			build: 'build/'
		},

		ftpush: {
			development: {
				auth: {
					host: 'exampledevelopment.com',
					port: 21,
					authKey: 'key1'
				},
				src: 'build/',
				dest: 'html/', // Target public directory
				exclusions: ['build/**/.DS_Store', 'build/**/Thumbs.db', 'build/tmp'],
				simple: false,
				useList: false
			},
			production: {
				auth: {
					host: 'exampleproduction.com',
					port: 21,
					authKey: 'key2'
				},
				src: 'build/',
				dest: 'html/', // Target public directory
				exclusions: ['build/**/.DS_Store', 'build/**/Thumbs.db', 'build/tmp'],
				simple: false,
				useList: false
			}
		},

		push: {
			options: {
				files: ['package.json'],
				updateConfigs: [],
				releaseBranch: false,
				add: true,
				addFiles: ['.'],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: [' --all'], // '-a' for all files
				createTag: false,
				push: true,
				pushTo: 'origin',
				npm: false,
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
			}
		}


	});

	require('load-grunt-tasks')(grunt);
	var helpers = require('handlebars-helpers');
	grunt.loadNpmTasks('assemble');

	grunt.registerTask('default', [
		'concat',
		'uglify',
		'sass',
		'autoprefixer',
		'cssmin',
		'assemble',
		'imagemin',
		'copy'
	]);
	
	grunt.registerTask('css', [
		'sass',
		'autoprefixer',
		'cssmin'
	]);
	
	grunt.registerTask('local', [
		'concat',
		'uglify',
		'sass',
		'autoprefixer',
		'cssmin',
		'assemble',
		'imagemin',
		'copy',
		'connect',
		'watch'
	]);

	grunt.registerTask('build', [
		'concat',
		'uglify',
		'sass',
		'autoprefixer',
		'cssmin',
		'assemble',
		'imagemin',
		'copy'
	]);

	grunt.registerTask('save', [
		'push'
	]);

	grunt.registerTask('development', [
		'clean',
		'build',
		'ftpush:development'
	]);

	grunt.registerTask('deploy', [
		'push',
		'clean',
		'build',
		'ftpush:production'
	]);
};