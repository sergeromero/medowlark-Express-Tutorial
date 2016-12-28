suite('"About" Page Tests', function(){
    test('page should contain link to contacts page', function(){
        assert($('a[href="/contact"]').length);
    });
});