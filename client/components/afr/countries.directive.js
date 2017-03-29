angular.module('afrostreamAdminApp')
.directive('countries', function() {
  var link =      function link(scope, element, attrs) {
    // default values
    scope.props = scope.props || {};
    scope.props.countries = scope.props.countries || [];
    // FIXME: this list should be loaded from the api.
    // main code
    scope.countries = [
      { _id: 'GB', name: 'Angleterre' },
      // FR
      { _id: 'FR', name: 'France' },
      // outre mer
      { _id: 'GF', name: 'Guyane française' },
      { _id: 'GP', name: 'Guadeloupe' },
      { _id: 'MF', name: 'Saint Martin' },
      { _id: 'MQ', name: 'Martinique' },
      { _id: 'PF', name: 'Polynésie française' },
      { _id: 'RE', name: 'Réunion' },
      // EU
      { _id: 'BE', name: 'Belgique' },
      { _id: 'CH', name: 'Suisse' },
      { _id: 'LU', name: 'Luxembourg' },
      // Afrique
      { _id: 'BF', name: 'Burkina Faso' },
      { _id: 'BI', name: 'Burundi' },
      { _id: 'BJ', name: 'Benin' },
      { _id: 'CD', name: 'Congo, The Democratic Republic of the' },
      { _id: 'CF', name: 'Central African Republic' },
      { _id: 'CG', name: 'Congo' },
      { _id: 'CI', name: 'Côté d\'Ivoire' },
      { _id: 'CM', name: 'Cameroon' },
      { _id: 'CV', name: 'Cape Verde' },
      { _id: 'DJ', name: 'Djibouti' },
      { _id: 'GA', name: 'Gabon' },
      { _id: 'GN', name: 'Guinea' },
      { _id: 'GQ', name: 'Equatorial Guinea' },
      { _id: 'GW', name: 'Guinea-Bissau' },
      { _id: 'KM', name: 'Comoros' },
      { _id: 'MG', name: 'Madagascar' },
      { _id: 'ML', name: 'Mali' },
      { _id: 'MR', name: 'Mauritania' },
      { _id: 'MU', name: 'Mauritius' },
      { _id: 'NE', name: 'Niger' },
      { _id: 'SC', name: 'Seychelles' },
      { _id: 'SN', name: 'Sénégal' },
      { _id: 'TD', name: 'Chad' },
      { _id: 'TG', name: 'Togo' }
    ];
    scope.toggle = function (country) {
      var p = scope.props.countries.indexOf(country._id);
      if (p === -1) {
        scope.props.countries.push(country._id);
      } else {
        scope.props.countries.splice(p, 1);
      }
      scope.props.onChange(scope.props.countries);
    };
  };
  return {
     restrict: 'E',
     scope: { props: '=' },
     templateUrl: 'components/afr/countries.html',
     link: link
   };
});
