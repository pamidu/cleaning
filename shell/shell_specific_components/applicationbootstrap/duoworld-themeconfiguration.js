/*DuoWorld Theme Configuration*/

mambatiFrameworkShell.config(function($mdThemingProvider){

  $mdThemingProvider.definePalette('12thDoorPrimary', {
    '50': '235B91',
    '100': '235B91',
    '200': '235B91',
    '300': '235B91',
    '400': '235B91',
    '500': '235B91',
    '600': '235B91',
    '700': '235B91',
    '800': '235B91',
    '900': '235B91',
    'A100': '235B91',
    'A200': '235B91',
    'A400': '235B91',
    'A700': '235B91',
    'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': undefined    // could also specify this if default was 'dark'

  });

    $mdThemingProvider.definePalette('12thDoorAccent', {
    '50': 'ffffff',
    '100': 'ffffff',
    '200': 'ffffff',
    '300': 'ffffff',
    '400': 'ffffff',
    '500': 'ffffff',
    '600': 'ffffff',
    '700': 'ffffff',
    '800': 'ffffff',
    '900': 'ffffff',
    'A100': 'ffffff',
    'A200': 'ffffff',
    'A400': 'ffffff',
    'A700': 'ffffff',
    'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
                                        // on this palette should be dark or light
    'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
     '200', '300', '400', 'A100'],
    'contrastLightColors': '7c7c7c'    // could also specify this if default was 'dark'
  });

  $mdThemingProvider.theme('default')
    .primaryPalette('12thDoorPrimary')
    .accentPalette('12thDoorAccent')
    .warnPalette('red');

  	$mdThemingProvider.alwaysWatchTheme(true);
});
