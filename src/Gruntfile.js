module.exports = function(grunt){
    //load plugins
    [
        'grunt-cafe-mocha',
        'grunt-contrib-jshint'
    ].forEach(function(task){
        grunt.loadNpmTasks(task);
    });

    //config plugins
    grunt.initConfig({
        cafemocha: { all: { src: 'public\\qa\\tests-*.js', options: { ui: 'tdd' }, } },
        jshint: { 
            app: ['meadowlark.js', 'public\\js\\**\\*.js', 'lib\\**\\*.js'],
            qa: ['Gruntfile.js', 'public\\qa\\**\\*.js', 'qa\\**\\*.js']
        }
    });

    //register tasks
    grunt.registerTask('default', ['cafemocha', 'jshint']);
};