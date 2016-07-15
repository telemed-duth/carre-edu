'use strict';
angular.module('edumaterialApp')
  .service('Translate', function (Auth) {
    var TranslationObj = {
      'en':{
    
        'depth_of_coverage':'Depth of Coverage',
        'comprehensiveness':'Comprehensiveness',
        'relevancy':'Relevancy',
        'accuracy':'Accuracy',
        'educational_level':'Educational level',
        'validity':'Validity',
        
        'total_results':'results',
        'no_results':'No results...',
        'back_button':'Back',
        'rating_button':'Rating',
        'rating_title':'Article Rating',
        
        'home_page':'Home',
        'login':'Log in',
        'logout':'Log out',
        
        "pagination_next":"Next",
        "pagination_prev":"Previous"
      },
      
      'el':{
        'depth_of_coverage':'Βάθος ανάλυσης περιεχομένου',
        'comprehensiveness':'Κατανόηση',
        'relevancy':'Σχετικότητα',
        'accuracy':'Ακρίβεια',
        'educational_level':'Απαιτούμενο επίπεδο εκπαίδευσης',
        'validity':'Εγκυρότητα',
        
        'total_results':'αποτελέσματα',
        'no_results':'Κανένα αποτέλεσμα...',
        'back_button':'Πίσω',
        'rating_button':'Αξιολόγηση',
        'rating_title':'Αξιολόγηση περιεχομένου',
        
        'home_page':'Αρχική',
        'login':'Σύνδεση',
        'logout':'Αποσύνδεση',
        
        "pagination_next":"Επόμενα",
        "pagination_prev":"Προηγούμενα"
      },
      
      'lt':{
        'depth_of_coverage':'Gylis dangos',
        'comprehensiveness':'Išsamumas',
        'relevancy':'Tinkamumas',
        'accuracy':'Tikslumas',
        'educational_level':'Išsilavinimo lygis reikalavimai',
        'validity':'Galiojimas',
        
        'total_results':'rezultatai',
        'no_results':'Jokių rezultatų...',
        'back_button':'Atgal',
        'rating_button':'Reitingas',
        'rating_title':'Vertinimas straipsnis',
        
        'home_page':'Titulinis puslapis',
        'login':'Prisijungti',
        'logout':'Atsijungti',
        
        "pagination_next":"Kitas",
        "pagination_prev":"Ankstesnis"
      },
      
      
    }
    
    return function(str){
      if(!Auth.language) return str;
      return TranslationObj[Auth.language].hasOwnProperty(str)?TranslationObj[Auth.language][str]:str;
    }
    
  })
  .filter('translate',function(Translate){
    return function(input){
      return Translate(input);
    }
  });
