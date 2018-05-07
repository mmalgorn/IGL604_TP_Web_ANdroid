'use strict';

describe('Controller: MatchuCtrl', function () {

  // load the controller's module
  beforeEach(module('tennisAppApp'));

  var MatchuCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MatchuCtrl = $controller('MatchuCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MatchuCtrl.awesomeThings.length).toBe(3);
  });
});
