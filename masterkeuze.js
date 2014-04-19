if (Meteor.isClient) {

  // Faculties
  Template.faculties.faculties = function () {
    return Session.get("Faculties");
  };

  Template.faculties.created = function () {
    Meteor.call("getFaculties", function(error, faculties){
      if(error)
        console.log(error)

      Session.set("Faculties", faculties);
    })
  };

  Template.faculties.events = {
    'click a': function() {
      Session.set("Faculty", this.organisatieOnderdeel.organisatieEenheidCode)
    }
  };

  // Studies
  Template.studies.faculty = function(){
    return Session.get("Faculty");
  }

  Template.studies.studies = function () {
    return Session.get("Studies");
  };

  Deps.autorun(function updateFaculty () {
    if(Session.equals("Faculty", undefined)) return;

    Meteor.call("getStudies", Session.get("Faculty"), function(error, studies){
      if(error)
        console.log(error)

      Session.set("Studies", studies);
    });
  });

  Template.studies.events = {
    'click a': function() {
      Session.set("Study",this)
    }
  };

  // Courses
  Template.courses.study = function(){
    return (Session.equals("Study", undefined)) ? null : Session.get("Study").naamNL;
  }

  Template.courses.courses = function(){
      var study = Session.get("Study");

      // Find all attributes named Vak   
      console.log(_.flatten(collectPropertyValue(study, "vak", [])))   
  }

  function collectPropertyValue(object, property, result){
    for(attr in object) {
      if(attr === property) {
        result.push(object[attr]);
      } else if(object[attr] !== null && typeof object[attr] === 'object') {
        collectPropertyValue(object[attr], property, result);
      }
    }

    return result;
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    getFaculties: function () {
      this.unblock();
      var result = Meteor.http.get("https://api.tudelft.nl/v0/faculteiten");
      return JSON.parse(result.content).getFaculteitenResponse.faculteit;
    },
    getStudies: function (faculty) {
      this.unblock();
      var result = Meteor.http.get("https://api.tudelft.nl/v0/opleidingen/" + faculty);
      return JSON.parse(result.content).getOpleidingenByFacultyAndYearResponse.opleiding;
    }
  });
}
