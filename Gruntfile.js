module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'assets/css/app.css': 'assets/sass/app.sass'
				}
			}
		},

		autoprefixer: {
			options: {
				browsers: ['last 2 version']
			},
			single_file: {
				src: 'assets/css/app.css',
				dest: 'assets/css/app.pf.css'
			}
		},

		cssmin: {
			combine: {
				files: {
					'assets/css/app.min.css': ['assets/css/app.pf.css']
				}
			}
		},

		jshint: {
			beforeconcat: ['assets/js/*.js']
		},

		concat: {
			dist: {
				src: [
					'assets/js/libs/*.js',
					'js/app.js'
				],
				dest: 'assets/js/build/app.js'
			}
		},

		uglify: {
			build: {
				src: 'assets/js/build/app.js',
				dest: 'assets/js/build/app.min.js'
			}
		},

		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'assets/img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'assets/img/build/'
				}]
			}
		},

		watch: {
			options: {
				livereload: true,
			},
			scripts: {
				files: ['assets/js/*.js'],
				tasks: ['concat', 'uglify', 'jshint'],
				options: {
					spawn: false,
				}
			},
			css: {
				files: ['assets/css/*.scss'],
				tasks: ['sass', 'autoprefixer', 'cssmin'],
				options: {
					spawn: false,
				}
			},
			images: {
				files: ['assets/images/**/*.{png,jpg,gif}', 'assets/images/*.{png,jpg,gif}'],
				tasks: ['imagemin'],
				options: {
					spawn: false,
				}
			}
		},

		connect: {
			server: {
				options: {
					port: 8000,
					base: './'
				}
			}
		},

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['concat', 'uglify', 'sass', 'imagemin']);
	grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);
	grunt.registerTask('dev', ['connect', 'watch']);

};