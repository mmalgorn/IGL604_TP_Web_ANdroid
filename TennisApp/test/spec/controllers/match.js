'use strict';

describe('Controller: MatchCtrl', function () {

  // load the controller's module
  beforeEach(module('tennisAppApp'));

  var MatchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MatchCtrl = $controller('MatchCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MatchCtrl.awesomeThings.length).toBe(3);
  });
});
