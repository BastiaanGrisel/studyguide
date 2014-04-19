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
      if(study !== undefined) {
        console.log(study.studieprogrammaboom.studieprogramma.studieprogrammaboom.studieprogramma)
      }
      // console.log(study.studieprogrammaboom.studieprogramma.studieprogrammaboom.studieprogramma)
      // return study.studieprogrammaboom.studieprogramma.studieprogrammaboom.studieprogramma;
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
