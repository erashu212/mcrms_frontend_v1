import { Component, OnInit } from '@angular/core';
import { disableDeprecatedForms, provideForms, FormGroup, FormArray, FormControl, REACTIVE_FORM_DIRECTIVES, Validators, FormBuilder } from '@angular/forms';
import 'rxjs/Rx';

import { HttpService } from '../../http.service';
import { Speaker } from '../../speaker';

// import 'ng2-datetime/src/vendor/bootstrap-datepicker/bootstrap-datepicker.min.js';

@Component({
  selector: 'admin-speaker',
  templateUrl: 'speaker.component.html',
  styleUrls: ['speaker.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES],
  providers: [HttpService]
})
export class AdminSpeakerComponent implements OnInit {
  public myForm: FormGroup;
  lectures: FormArray;
  
  public speaker: Speaker;
  errorMessage: string = '';
  isLoading: boolean = true;


  // public infoGroup1DueDate: string;
  public infoGroup1DueDate = "10/12/16";
  public infoGroup2DueDate = "11/12/16";
  public infoGroup3DueDate = "12/31/16";
  public conferenceyears = "2013, 2014, 2015, 2016";
  public sessionorevents = [
    { value: 'session', display: 'Session' },
    { value: 'event', display: 'Event' }
  ];
  public segment = [
    { value: 'sat-am-pre-break', display: 'Sat AM Pre Break' },
    { value: 'sat-am-post-break', display: 'Sat AM Post Break' },
    { value: 'sat-pm-pre-break', display: 'Sat PM Pre Break' },
    { value: 'sat-pm-post-break', display: 'Sat PM Post Break' },
    { value: 'sun-am-pre-break', display: 'Sun AM Pre Break' },
    { value: 'sun-am-post-break', display: 'Sun AM Post Break' },
    { value: 'sun-pm-pre-break', display: 'Sun PM Pre Break' },
    { value: 'sun-pm-post-break', display: 'Sun PM Post Break' },   
    { value: 'mon-am-pre-break', display: 'Mon AM Pre Break' },
    { value: 'mon-am-post-break', display: 'Mon AM Post Break' },
    { value: 'mon-pm-pre-break', display: 'Mon PM Pre Break' },
    { value: 'mon-pm-post-break', display: 'Mon PM Post Break' },
    { value: 'tue-am-pre-break', display: 'Tue AM Pre Break' },
    { value: 'tue-am-post-break', display: 'Tue AM Post Break' },
    { value: 'tue-pm-pre-break', display: 'Tue PM Pre Break' },
    { value: 'tue-pm-post-break', display: 'Tue PM Post Break' },
    { value: 'wed-am-pre-break', display: 'Wed AM Pre Break' },
    { value: 'wed-am-post-break', display: 'Wed AM Post Break' },
    { value: 'wed-pm-pre-break', display: 'Wed PM Pre Break' },
    { value: 'wed-pm-post-break', display: 'Wed PM Post Break' },
    { value: 'thu-am-pre-break', display: 'Thu AM Pre Break' },
    { value: 'thu-am-post-break', display: 'Thu AM Post Break' },
    { value: 'thu-pm-pre-break', display: 'Thu PM Pre Break' },
    { value: 'thu-pm-post-break', display: 'Thu PM Post Break' },
    { value: 'fri-am-pre-break', display: 'Fri AM Pre Break' },
    { value: 'fri-am-post-break', display: 'Fri AM Post Break' },
    { value: 'fri-pm-pre-break', display: 'Fri PM Pre Break' },
    { value: 'fri-pm-post-break', display: 'Fri PM Post Break' }
  ]
  public confirmationstatus = [
    { value: 'invited', display: 'Invited' },
    { value: 'pending', display: 'Pending' },
    { value: 'confirmedyes', display: 'Confirmed Yes' },
    { value: 'confirmedno', display: 'Confirmed Cannot Speak' }
  ];
  public speakingrole = [
    { value: 'sessionleader', display: 'Session Leader' },
    { value: 'primary', display: 'Primary' },
    { value: 'panelist', display: 'Panelist' }
  ];
  public moderator = [
    { value: 'speaker1', display: 'Speaker1' },
    { value: 'speaker2', display: 'Speaker2' },
    { value: 'speaker3', display: 'Speaker3' },
    { value: 'speaker4', display: 'Speaker4' },
    { value: 'speaker5', display: 'Speaker5' },
    { value: 'speaker6', display: 'Speaker6' },
    { value: 'speaker7', display: 'Speaker7' },
    { value: 'speaker8', display: 'Speaker8' },
    { value: 'speaker9', display: 'Speaker9' },
    { value: 'speaker10', display: 'Speaker10' },
    { value: 'speaker11', display: 'Speaker11' },
    { value: 'speaker12', display: 'Speaker12' },
    { value: 'speaker13', display: 'Speaker13' },
    { value: 'speaker14', display: 'Speaker14' },
    { value: 'speaker15', display: 'Speaker15' },
    { value: 'speaker16', display: 'Speaker16' },
    { value: 'speaker17', display: 'Speaker17' },
    { value: 'speaker18', display: 'Speaker18' },
    { value: 'speaker19', display: 'Speaker19' },
    { value: 'speaker20', display: 'Speaker20' }
  ];
  public receiptstatus = [
    { value: 'incomplete', display: 'Incomplete' },
    { value: 'submitted', display: 'Submitted' },
    { value: 'complete', display: 'Complete' },
    { value: 'na', display: 'N/A' }
  ];
  public states = [
    { value: 'AL', display: 'Alabama' },
    { value: 'AK', display: 'Alaska' },
    { value: 'AZ', display: 'Arizona' },
    { value: 'AR', display: 'Arkansas' },
    { value: 'CA', display: 'California' },
    { value: 'CO', display: 'Colorado' },
    { value: 'CT', display: 'Connecticut' },
    { value: 'DE', display: 'Delaware' },
    { value: 'DC', display: 'District Of Columbia' },
    { value: 'FL', display: 'Florida' },
    { value: 'GA', display: 'Georgia' },
    { value: 'HI', display: 'Hawaii' },
    { value: 'ID', display: 'Idaho' },
    { value: 'IL', display: 'Illinois' },
    { value: 'IN', display: 'Indiana' },
    { value: 'IA', display: 'Iowa' },
    { value: 'KS', display: 'Kansas' },
    { value: 'KY', display: 'Kentucky' },
    { value: 'LA', display: 'Louisiana' },
    { value: 'ME', display: 'Maine' },
    { value: 'MD', display: 'Maryland' },
    { value: 'MA', display: 'Massachusetts' },
    { value: 'MI', display: 'Michigan' },
    { value: 'MN', display: 'Minnesota' },
    { value: 'MS', display: 'Mississippi' },
    { value: 'MO', display: 'Missouri' },
    { value: 'MT', display: 'Montana' },
    { value: 'NE', display: 'Nebraska' },
    { value: 'NV', display: 'Nevada' },
    { value: 'NH', display: 'New Hampshire' },
    { value: 'NJ', display: 'New Jersey' },
    { value: 'NM', display: 'New Mexico' },
    { value: 'NY', display: 'New York' },
    { value: 'NC', display: 'North Carolina' },
    { value: 'ND', display: 'North Dakota' },
    { value: 'OH', display: 'Ohio' },
    { value: 'OK', display: 'Oklahoma' },
    { value: 'OR', display: 'Oregon' },
    { value: 'PA', display: 'Pennsylvania' },
    { value: 'RI', display: 'Rhode Island' },
    { value: 'SC', display: 'South Carolina' },
    { value: 'SD', display: 'South Dakota' },
    { value: 'TN', display: 'Tennessee' },
    { value: 'TX', display: 'Texas' },
    { value: 'UT', display: 'Utah' },
    { value: 'VT', display: 'Vermont' },
    { value: 'VA', display: 'Virginia' },
    { value: 'WA', display: 'Washington' },
    { value: 'WV', display: 'West Virginia' },
    { value: 'WI', display: 'Wisconsin' },
    { value: 'WY', display: 'Wyoming' },
  ]
  constructor(private httpService: HttpService, private _fb: FormBuilder){
    this.myForm = _fb.group({
      sessionordernumber: ['',[]],
      timeslot: ['',[]],
      sessionorevents: ['session',[]],
      committeemembername: ['',[]],
      lengthofspeach: ['',[Validators.pattern('[0-9]+')]],
      additionalspeakers: ['',[]],
      // segment: ['',[]],

      postconference: [false,[]],
      individualpresentation: [false,[]],
      leadpaneldiscussion: [false,[]],
      paneldiscussionmoderator: [false,[]],
      firstname: ['',
          [
            Validators.required
          ]
        ],
      lastname: ['',[
        Validators.required
      ]],
      credentials: ['',[]],
      email: ['',[
        Validators.required
        // Validators.pattern["(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"]
      ]],

      phone: ['',[]],
      address: this._fb.group({
        street1: [],
        street2: [],
        city: [],
        // state: [],
        state: ['',[]],
        zipcode: ['',[
          Validators.minLength(5),
          Validators.maxLength(5),
          Validators.pattern('[0-9]+')
        ]]
      }),
      firstname2: ['',[]],
      lastname2: ['',[]],
      email2: ['',[]],
      confirmationstatus: ['incomplete',[]],
      speakingrole: ['incomplete',[]],
      moderator: ['incomplete',[]],
      titlestatus: ['incomplete',[]],
      descstatus: ['incomplete',[]],
      objstatus: ['incomplete',[]],
      outlinestatus: ['incomplete',[]],
      atteststatus: ['incomplete',[]],
      disclosurestatus: ['incomplete',[]],
      cvsstatus: ['incomplete',[]],
      biostatus: ['incomplete',[]],
      photostatus: ['incomplete',[]],
      contdatastatus: ['incomplete',[]],
      seccontactstatus: ['incomplete',[]],
      spkrlistingstatus: ['incomplete',[]],
      hotelstatus: ['incomplete',[]],
      avstatus: ['incomplete',[]],
      pptstatus: ['incomplete',[]],
      vip: [false,[]],
      hotel: ['',[]],
      numberofnights: ['',[]],
      specialinstructions: ['',[]],

      lectures: this.buildArray(),

      laserpointerneeded: [false,[]],
      computerneeded: [false,[]],
      appleneeded: [false,[]],
      pcneeded: [false,[]],
      uoc: [false,[]],
      uocapple: [false,[]],
      uocpc: [false,[]]
    });
  }

  buildArray(): FormArray {
    this.lectures = this._fb.array([
      this.buildGroup()
    ]);
    return this.lectures;
  }

  buildGroup(): FormGroup {
    return this._fb.group({
      title: '',
      description: '',
      objective: '',
      outline: '',
      segment: ''
      // sessionnum: ''
    });
  }
  addLecture() {
    this.lectures.push(this.buildGroup());
  }
  removeLecture(i: number) {
    console.log("i: " + i);
    this.lectures.removeAt(i);
  }

  ngOnInit() {
  }
  save(){
    // // alert(this.myForm.value)
    // alert(JSON.stringify(this.myForm.value));
    // this.peopleService.save(Speaker);
    // this.speaker = 
    const newRecipe = this.myForm.value;
    console.log("speaker: " + newRecipe);
    this.httpService.saveSpeaker(newRecipe)
        .subscribe(
          data => console.log(data)
        );
    
  }
  emailLandingLink(formValues){
    alert(formValues)
  }
  onSubmit(username: string, email: string) {
    this.httpService.sendData({username: username, email: email})      // sends object to service
        .subscribe(
            data => console.log(data)
        );
  }
}
