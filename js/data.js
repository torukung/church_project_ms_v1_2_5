// GENERATED from fixtures/*.json by tools/gen-data.js — do not hand-edit numbers here.
// Regenerate whenever fixtures change: node tools/gen-data.js. Every dashboard number must derive from this.
window.CBP_DATA = {
  "TODAY": "2026-08-28",
  "budget_year": 2026,
  "countries": [
    {
      "code": "BGD",
      "name": "Bangladesh",
      "ceiling": 1000000
    },
    {
      "code": "NPL",
      "name": "Nepal",
      "ceiling": 1000000
    },
    {
      "code": "KHM",
      "name": "Cambodia",
      "ceiling": 1000000
    },
    {
      "code": "IND",
      "name": "India",
      "ceiling": 1000000
    },
    {
      "code": "MMR",
      "name": "Myanmar",
      "ceiling": 1000000
    },
    {
      "code": "LAO",
      "name": "Lao PDR",
      "ceiling": 1000000
    },
    {
      "code": "HKG",
      "name": "Hong Kong",
      "ceiling": 1000000
    }
  ],
  "projects": [
    {
      "id": "WE26BGD0002",
      "name": "CARE \u2014 WASH & Nutrition",
      "country": "BGD",
      "status": 3,
      "amount": 760801,
      "owner": "anik",
      "backup": "priya",
      "primary_implementer": "CARE",
      "strategic_priority": "Water & Sanitation",
      "target_date": "2026-06-30",
      "submitted_at": "2026-01-30",
      "gate": {
        "decision_point": {
          "submitted_at": "2026-02-12",
          "approved_at": "2026-02-26"
        },
        "chas": {
          "submitted_at": "2026-02-12",
          "approved_at": null,
          "remark": "resubmitted docs 14 Jul"
        }
      },
      "d_in_q_start": "2026-01-30",
      "chas_guid": "179b35dc-66ed-4c55-a0a6-4e815a72c810"
    },
    {
      "id": "WE26BGD0003",
      "name": "WFP \u2014 School Feeding",
      "country": "BGD",
      "status": 4,
      "amount": 300000,
      "owner": "anik",
      "primary_implementer": "WFP",
      "target_date": "2026-09-15",
      "chas_guid": "c9a95c3e-4511-4a90-aa74-3f3426daa5cd"
    },
    {
      "id": "WE26BGD0005",
      "name": "Emergency Shelter Kits",
      "country": "BGD",
      "status": 4,
      "amount": 250000,
      "owner": "daniel",
      "primary_implementer": "Local partner",
      "target_date": "2026-08-31",
      "demo_role": "THE walk project \u2014 M2 submits, M1 approves through the full gate in the demo script",
      "chas_guid": "27eccdfa-8fa2-451e-afa1-65107a69a69a"
    },
    {
      "id": "WE25NPL0007",
      "name": "Community Water Systems",
      "country": "NPL",
      "status": 1,
      "amount": 292000,
      "owner": "sunita",
      "primary_implementer": "Local partner",
      "implementation_date": "2026-03-01",
      "phases": [
        {
          "phase": "Procurement",
          "start": "2026-03-01",
          "end": "2026-04-15"
        },
        {
          "phase": "Construction",
          "start": "2026-04-16",
          "end": "2026-09-30"
        },
        {
          "phase": "Handover",
          "start": "2026-10-01",
          "end": "2026-10-31"
        }
      ],
      "chas_guid": "43b18607-28df-4474-a103-4326023bdf22"
    },
    {
      "id": "WE26NPL0010",
      "name": "Days for Girls",
      "country": "NPL",
      "status": 3,
      "amount": 188400,
      "owner": "sunita",
      "primary_implementer": "Days for Girls Intl",
      "target_date": "2026-08-14",
      "submitted_at": "2026-07-28",
      "past_target": true,
      "chas_guid": "77374a34-3a17-4ec3-adb0-e43b4882b7c6"
    },
    {
      "id": "WE26NPL0011",
      "name": "Winterisation Support",
      "country": "NPL",
      "status": 4,
      "amount": 400000,
      "owner": "sunita",
      "target_date": "2026-10-30",
      "chas_guid": "6e5d00ca-2cb3-4638-ad40-7823d04d5d72"
    },
    {
      "id": "WE26KHM0003",
      "name": "Vision Screening Programme",
      "country": "KHM",
      "status": 2,
      "amount": 612000,
      "owner": "chan",
      "primary_implementer": "Local partner",
      "approved_at": "2026-08-19",
      "refs": {
        "decision_point": "DP-2026-0455",
        "chas": "CHS-77812"
      },
      "chas_guid": "65b6666b-e8f8-45f5-a65c-0f340451b52c"
    },
    {
      "id": "WE26IND0006",
      "name": "Mobility Devices",
      "country": "IND",
      "status": 1,
      "amount": 94200,
      "owner": "ravi",
      "implementation_date": "2026-07-01",
      "chas_guid": "165f175e-e782-4598-a75c-e238b37eb7ae"
    },
    {
      "id": "WE26IND0008",
      "name": "Maternal Health Training",
      "country": "IND",
      "status": 2,
      "amount": 260000,
      "owner": "ravi",
      "approved_at": "2026-08-26",
      "refs": {
        "decision_point": "DP-2026-0489",
        "chas": "CHS-78003"
      },
      "chas_guid": "6bbe12a7-48c2-4b4f-a8b1-1127a4c1f215"
    },
    {
      "id": "WE26MMR0004",
      "name": "Food Security Baskets",
      "country": "MMR",
      "status": 1,
      "amount": 505000,
      "owner": null,
      "implementation_date": "2026-05-01",
      "unassigned": true,
      "chas_guid": "6257b1c7-f0cc-40b6-ae4b-ea78db5fcca4"
    },
    {
      "id": "WE26MMR0009",
      "name": "Clinic Rehabilitation",
      "country": "MMR",
      "status": 3,
      "amount": 122000,
      "owner": null,
      "submitted_at": "2026-08-16",
      "unassigned": true,
      "chas_guid": "8006a45b-28d4-4a0c-aa1c-904c505a7c12"
    },
    {
      "id": "WE26LAO0002",
      "name": "School WASH Blocks",
      "country": "LAO",
      "status": 4,
      "amount": 188000,
      "owner": null,
      "target_date": "2026-11-30",
      "unassigned": true,
      "chas_guid": "2ec28996-79d0-4e99-ae0a-78d0bf1799dc"
    },
    {
      "id": "WE26HKG0001",
      "name": "Crossroads Foundation \u2014 Goods redistribution hub",
      "country": "HKG",
      "status": 1,
      "amount": 420000,
      "owner": "wing",
      "backup": "daniel",
      "primary_implementer": "Crossroads Foundation",
      "strategic_priority": "Food Security",
      "implementation_date": "2026-04-01",
      "target_date": "2026-11-30",
      "approved_at": "2026-03-20",
      "refs": {
        "decision_point": "DP-2026-0198",
        "chas": "CHS-76540"
      },
      "gate": {
        "decision_point": {
          "submitted_at": "2026-02-18",
          "approved_at": "2026-03-05"
        },
        "chas": {
          "submitted_at": "2026-02-18",
          "approved_at": "2026-03-12"
        }
      },
      "phases": [
        {
          "phase": "Setup",
          "start": "2026-04-01",
          "end": "2026-05-31"
        },
        {
          "phase": "Distribution rounds",
          "start": "2026-06-01",
          "end": "2026-09-15"
        },
        {
          "phase": "Wrap-up",
          "start": "2026-09-16",
          "end": "2026-11-30"
        }
      ],
      "d_in_q_start": "2026-02-10",
      "chas_guid": "6960d120-fd4b-4e24-aa96-2f2240e0c8f3"
    },
    {
      "id": "WE26HKG0002",
      "name": "Food Angel \u2014 Community kitchen expansion",
      "country": "HKG",
      "status": 3,
      "amount": 310000,
      "owner": "wing",
      "backup": "daniel",
      "primary_implementer": "Food Angel",
      "strategic_priority": "Food Security",
      "submitted_at": "2026-08-20",
      "gate": {
        "decision_point": {
          "submitted_at": "2026-08-24",
          "approved_at": null
        }
      },
      "d_in_q_start": "2026-08-20",
      "chas_guid": "5ee6d1a4-b791-4f22-ad4e-b990c1f80915"
    },
    {
      "id": "WE26HKG0003",
      "name": "Elderly home retrofit \u2014 Kowloon",
      "country": "HKG",
      "status": 4,
      "amount": 150000,
      "owner": "wing",
      "primary_implementer": "St. James Settlement",
      "strategic_priority": "Aging & Care",
      "target_date": "2027-03-31",
      "chas_guid": "c1564979-019c-4174-aeb8-05228ec0d9ca"
    },
    {
      "id": "WE26HKG0004",
      "name": "Typhoon readiness kits",
      "country": "HKG",
      "status": 2,
      "amount": 95000,
      "owner": "wing",
      "primary_implementer": "HKRC",
      "strategic_priority": "Emergency Response",
      "submitted_at": "2026-07-28",
      "approved_at": "2026-08-10",
      "refs": {
        "decision_point": "DP-2026-0431",
        "chas": "CHS-77690"
      },
      "gate": {
        "decision_point": {
          "submitted_at": "2026-07-30",
          "approved_at": "2026-08-08"
        },
        "chas": {
          "submitted_at": "2026-07-30",
          "approved_at": "2026-08-08"
        }
      },
      "d_in_q_start": "2026-07-28",
      "chas_guid": "e00a580d-6c3a-4f77-a409-2780ee1c2eed"
    }
  ],
  "reconciliation": {
    "BGD": 1310801,
    "NPL": 880400,
    "KHM": 612000,
    "IND": 354200,
    "MMR": 627000,
    "LAO": 188000,
    "HKG": 975000,
    "note": "Committed per country = sum(amount) all statuses. Dashboard must derive, not hard-code. 3 unassigned projects drive the attention row."
  },
  "users": [
    {
      "id": "admin",
      "name": "Area Office Admin",
      "role": "admin",
      "country_scope": "all"
    },
    {
      "id": "priya",
      "name": "Priya N.",
      "role": "m1",
      "title": "Regional Manager \u00b7 South Asia",
      "country_scope": [
        "BGD",
        "NPL",
        "IND"
      ]
    },
    {
      "id": "marco",
      "name": "Marco T.",
      "role": "m1",
      "title": "Regional Manager \u00b7 Mekong",
      "country_scope": [
        "KHM",
        "MMR",
        "LAO"
      ]
    },
    {
      "id": "daniel",
      "name": "Daniel K.",
      "role": "m2",
      "title": "Area Manager",
      "country_scope": "all"
    },
    {
      "id": "anik",
      "name": "Anik R.",
      "role": "m3",
      "country_scope": [
        "BGD"
      ]
    },
    {
      "id": "sunita",
      "name": "Sunita M.",
      "role": "m3",
      "country_scope": [
        "NPL"
      ]
    },
    {
      "id": "santoso",
      "name": "Bp. Santoso",
      "role": "viewer",
      "view_scope": [
        "BGD",
        "NPL"
      ],
      "read_only": true,
      "note": "RD-3 print export allowed; every action control hidden"
    },
    {
      "id": "elena",
      "name": "Elena V.",
      "role": "ogc",
      "title": "Office of General Counsel \u00b7 Asia Area",
      "country_scope": "all",
      "note": "Contract reviewer (OGC). No project actions."
    },
    {
      "id": "rafael",
      "name": "Rafael T.",
      "role": "finance",
      "title": "Area Finance Reviewer",
      "country_scope": "all",
      "note": "Contract reviewer (Finance). No project actions."
    }
  ],
  "persona_switcher_order": [
    "anik",
    "daniel",
    "priya",
    "santoso",
    "elena"
  ],
  "delegations": [
    {
      "away": "marco",
      "delegate": "priya",
      "from": "2026-08-24",
      "to": "2026-09-05",
      "reason": "Annual leave"
    }
  ],
  "seed_attention": [
    {
      "rule": "gate-idle",
      "project": "WE26BGD0002",
      "system": "chas",
      "days": 197,
      "severity": "rose",
      "text": "CHaS gate \u2014 submitted 12 Feb, no approval yet"
    },
    {
      "rule": "over-ceiling",
      "country": "BGD",
      "amount_over": 310801,
      "coverage": 131,
      "severity": "rose",
      "text": "$310,801 above the 2026 allocation"
    },
    {
      "rule": "target-passed",
      "project": "WE26NPL0010",
      "days": 14,
      "severity": "brass",
      "text": "Target date passed, still in status 3 review"
    },
    {
      "rule": "unassigned",
      "count": 3,
      "projects": [
        "WE26MMR0004",
        "WE26MMR0009",
        "WE26LAO0002"
      ],
      "severity": "neutral",
      "text": "No owner set \u2014 alerts cannot route"
    }
  ],
  "activity_seed": [
    {
      "id": "L1",
      "project": "WE26BGD0002",
      "type": "system",
      "body": "Status changed 4 \u2192 3 (Request submitted)",
      "author": "daniel",
      "at": "2026-01-30"
    },
    {
      "id": "L2",
      "project": "WE26BGD0002",
      "type": "system",
      "body": "Decision Point \u2014 request approved",
      "author": "priya",
      "at": "2026-02-26"
    },
    {
      "id": "L3",
      "project": "WE26BGD0002",
      "type": "note",
      "body": "CHaS office asked for revised partner budget breakdown before they will progress the record.",
      "author": "priya",
      "at": "2026-07-10"
    },
    {
      "id": "L4",
      "project": "WE26BGD0002",
      "type": "note",
      "body": "Resubmitted full docs pack to CHaS on 14 Jul \u2014 remark recorded on the gate.",
      "author": "anik",
      "at": "2026-07-14",
      "parent": "L3"
    },
    {
      "id": "L5",
      "project": "WE26BGD0002",
      "type": "question",
      "body": "Do we split WASH and Nutrition into separate CHaS records if the gate stays idle past September?",
      "author": "daniel",
      "at": "2026-08-20",
      "assigned_to": "priya",
      "resolved_at": null
    },
    {
      "id": "L6",
      "project": "WE26BGD0002",
      "type": "decision",
      "body": "Keep as one combined record; escalate through the Area office if no CHaS response by 30 Sep.",
      "author": "priya",
      "at": "2026-08-25",
      "pinned": true
    },
    {
      "id": "L7",
      "project": "WE26BGD0005",
      "type": "note",
      "body": "Kit specification finalised with the local partner; unit cost $50 within plan.",
      "author": "daniel",
      "at": "2026-08-21"
    },
    {
      "id": "L8",
      "project": "WE26BGD0005",
      "type": "question",
      "body": "Confirm warehouse handling fees are inside the $250,000 envelope?",
      "author": "priya",
      "at": "2026-08-24",
      "assigned_to": "daniel",
      "resolved_at": "2026-08-26"
    },
    {
      "id": "L9",
      "project": "WE25NPL0007",
      "type": "system",
      "body": "Status changed 2 \u2192 1 (implementation started)",
      "author": "priya",
      "at": "2026-03-01"
    },
    {
      "id": "L10",
      "project": "WE25NPL0007",
      "type": "decision",
      "body": "Handover ceremony aligned to district schedule \u2014 31 Oct target confirmed.",
      "author": "sunita",
      "at": "2026-08-05",
      "pinned": true
    },
    {
      "id": "L11",
      "project": "WE26NPL0010",
      "type": "question",
      "body": "Target date has passed while in review \u2014 extend target or expedite?",
      "author": "sunita",
      "at": "2026-08-18",
      "assigned_to": "priya",
      "resolved_at": null
    },
    {
      "id": "L12",
      "project": "WE26MMR0009",
      "type": "note",
      "body": "Submitted without an owner \u2014 needs assignment before review can route alerts.",
      "author": "daniel",
      "at": "2026-08-17"
    },
    {
      "id": "L13",
      "project": "WE26HKG0002",
      "type": "system",
      "body": "Status changed 4 \u2192 3 (Request submitted)",
      "author": "wing",
      "at": "2026-08-20"
    },
    {
      "id": "L14",
      "project": "WE26HKG0001",
      "type": "note",
      "body": "Distribution rounds are on track to close on 15 Sep; wrap-up paperwork starts the day after.",
      "author": "wing",
      "at": "2026-08-25"
    }
  ],
  "comments_seed": [
    {
      "id": "C1",
      "project_id": "WE26BGD0002",
      "author": "anik",
      "at": "2026-08-18",
      "time": "14:05",
      "body": "CHaS still has not moved on this. I have chased the office twice since the 14 Jul resubmission \u2014 do we escalate through the Area office?",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C2",
      "project_id": "WE26BGD0002",
      "author": "priya",
      "at": "2026-08-19",
      "time": "09:20",
      "body": "Escalating is the right call if nothing lands by 30 Sep. Keep the partner budget breakdown attached so we are not asked for it a third time.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C3",
      "project_id": "WE26BGD0002",
      "author": "priya",
      "at": "2026-08-20",
      "time": "11:40",
      "body": "Decision Point cleared on 26 Feb. I am holding the 3 \u2014 2 move until CHaS records its approval: the reference number has to exist before I can mark this approved.",
      "kind": "approval_note",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C4",
      "project_id": "WE26BGD0002",
      "author": "anik",
      "at": "2026-08-21",
      "time": "16:15",
      "body": "Understood. The full docs pack went back to CHaS on 14 Jul and the remark is on the gate. I will post here the moment they issue a reference.",
      "kind": "approval_note",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C5",
      "project_id": "WE26BGD0005",
      "author": "daniel",
      "at": "2026-08-22",
      "time": "10:05",
      "body": "Kit specification is signed off with the local partner. Unit cost holds at $50, so the $250,000 envelope still stands.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C6",
      "project_id": "WE26BGD0005",
      "author": "daniel",
      "at": "2026-08-24",
      "time": "15:30",
      "body": "Submitting for review. Warehouse handling sits inside the envelope and the partner agreement is attached to the record.",
      "kind": "approval_note",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C7",
      "project_id": "WE26BGD0005",
      "author": "priya",
      "at": "2026-08-25",
      "time": "09:45",
      "body": "Reviewed. One thing before I approve it to the gate: confirm the handling fee line is the partner\u2019s own and not a second charge from the freight agent.",
      "kind": "approval_note",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C8",
      "project_id": "WE26BGD0003",
      "author": "anik",
      "at": "2026-08-26",
      "time": "13:10",
      "body": "WFP have asked whether the school feeding window can start a month earlier. That pulls the target date to 15 Aug \u2014 flagging it before we submit.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C9",
      "project_id": "WE25NPL0007",
      "author": "sunita",
      "at": "2026-08-17",
      "time": "08:50",
      "body": "Construction is on schedule for the 30 Sep finish. The handover ceremony is booked with the district for 31 Oct.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C10",
      "project_id": "WE26NPL0010",
      "author": "sunita",
      "at": "2026-08-23",
      "time": "12:25",
      "body": "The target date passed on 14 Aug while we are still in review. Either we extend the target or this needs expediting \u2014 I cannot hold the supplier price much longer.",
      "kind": "comment",
      "edited_at": null,
      "priority": true
    },
    {
      "id": "C11",
      "project_id": "WE26NPL0010",
      "author": "priya",
      "at": "2026-08-27",
      "time": "10:15",
      "body": "Extending the target to 30 Sep. Nothing about the request itself has changed, so it does not need to go back to development.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C12",
      "project_id": "WE26KHM0003",
      "author": "marco",
      "at": "2026-08-20",
      "time": "11:05",
      "body": "Approved on 19 Aug with both references recorded. Screening starts once the clinic rota is confirmed and no budget change is expected.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C13",
      "project_id": "WE26IND0008",
      "author": "ravi",
      "at": "2026-08-27",
      "time": "14:40",
      "body": "Approved on 26 Aug. The first training cohort is set for October; I will load the phase dates once the venue is confirmed.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C14",
      "project_id": "WE26MMR0009",
      "author": "daniel",
      "at": "2026-08-21",
      "time": "09:35",
      "body": "This one is still sitting without an owner, so no alert can route. I will assign it as soon as the Myanmar team confirm who is picking it up.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C15",
      "project_id": "WE26HKG0002",
      "author": "wing",
      "at": "2026-08-21",
      "time": "10:05",
      "body": "Kitchen No.4 lease signed \u2014 cost sheet attached to the request.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C16",
      "project_id": "WE26HKG0002",
      "author": "daniel",
      "at": "2026-08-22",
      "time": "09:40",
      "body": "Submitting this one for review. The lease and the partner\u2019s cost sheet are both on the record, so there is nothing outstanding from our side. Could M1 prioritise it? The fit-out has to finish before the winter meal programme opens.",
      "kind": "approval_note",
      "edited_at": null,
      "priority": false
    },
    {
      "id": "C17",
      "project_id": "WE26HKG0001",
      "author": "wing",
      "at": "2026-08-25",
      "time": "16:12",
      "body": "Distribution round 3 closed ahead of plan \u2014 41 tonnes moved through the hub this month. The rounds still finish on 15 Sep and wrap-up is unchanged.",
      "kind": "comment",
      "edited_at": null,
      "priority": false
    }
  ],
  "budget_history": [
    {
      "code": "BGD",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 940000,
          "spent_q": [
            180000,
            245000,
            260000,
            232000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 1080000,
          "spent_q": [
            215000,
            285000,
            300000,
            268000
          ]
        }
      },
      "plan_2027": 1100000
    },
    {
      "code": "NPL",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 760000,
          "spent_q": [
            150000,
            190000,
            205000,
            198000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 845000,
          "spent_q": [
            170000,
            215000,
            230000,
            218000
          ]
        }
      },
      "plan_2027": 920000
    },
    {
      "code": "KHM",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 540000,
          "spent_q": [
            105000,
            135000,
            145000,
            142000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 588000,
          "spent_q": [
            118000,
            148000,
            158000,
            152000
          ]
        }
      },
      "plan_2027": 650000
    },
    {
      "code": "IND",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 415000,
          "spent_q": [
            82000,
            104000,
            112000,
            109000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 372000,
          "spent_q": [
            74000,
            93000,
            100000,
            98000
          ]
        }
      },
      "plan_2027": 400000
    },
    {
      "code": "MMR",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 690000,
          "spent_q": [
            128000,
            172000,
            186000,
            190000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 605000,
          "spent_q": [
            115000,
            152000,
            164000,
            162000
          ]
        }
      },
      "plan_2027": 640000
    },
    {
      "code": "LAO",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 210000,
          "spent_q": [
            38000,
            52000,
            56000,
            58000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 165000,
          "spent_q": [
            30000,
            41000,
            45000,
            44000
          ]
        }
      },
      "plan_2027": 240000
    },
    {
      "code": "HKG",
      "years": {
        "2024": {
          "ceiling": 1000000,
          "committed": 580000,
          "spent_q": [
            112000,
            145000,
            158000,
            152000
          ]
        },
        "2025": {
          "ceiling": 1000000,
          "committed": 660000,
          "spent_q": [
            128000,
            165000,
            180000,
            172000
          ]
        }
      },
      "plan_2027": 900000
    }
  ],
  "integrations": {
    "chas": {
      "label": "CHaS \u00b7 Dynamics 365",
      "kind": "gate",
      "driver": "sim",
      "mode": "manual",
      "authoritative": true,
      "health": "ok",
      "last_sync_at": "2026-08-27",
      "endpoint_masked": "https://chas.crm.dynamics.com/api/data/v9.2/\u2026",
      "secret_set": false,
      "deep_link_template": "https://chas.crm.dynamics.com/main.aspx?appid=d7cf45b9-1d62-ea11-a811-000d3a579cbe&pagetype=entityrecord&etn=chas_humanitarianproject&id={chas_guid}",
      "mapping": [
        {
          "portal_field": "id",
          "ext_field": "chas_projectid (Project ID)",
          "direction": "key",
          "note": "WE26BGD0004 pattern"
        },
        {
          "portal_field": "chas_guid",
          "ext_field": "chas_humanitarianprojectid",
          "direction": "key",
          "note": "record GUID for deep link"
        },
        {
          "portal_field": "gate.chas.submitted_at",
          "ext_field": "createdon / statuscode=Submitted",
          "direction": "write",
          "note": "portal lodges"
        },
        {
          "portal_field": "gate.chas.approved_at",
          "ext_field": "statuscode=Approved \u00b7 modifiedon",
          "direction": "read",
          "note": "CHaS is authoritative"
        },
        {
          "portal_field": "refs.chas",
          "ext_field": "chas_projectid",
          "direction": "read",
          "note": ""
        },
        {
          "portal_field": "status",
          "ext_field": "statuscode",
          "direction": "write",
          "note": "Active / Implementation mirror"
        },
        {
          "portal_field": "primary_contract_id",
          "ext_field": "chas_contractref (custom)",
          "direction": "write",
          "note": "S-11 contract_sent"
        }
      ],
      "stats": {
        "ok": 0,
        "failed": 0,
        "proposals": 0
      }
    },
    "decision_point": {
      "label": "Decision Point",
      "kind": "gate",
      "driver": "deeplink",
      "mode": "manual",
      "authoritative": true,
      "health": "off",
      "last_sync_at": null,
      "endpoint_masked": "",
      "secret_set": false,
      "deep_link_template": "https://decisionpoint.example.org/requests/{decision_point_ref}",
      "mapping": [
        {
          "portal_field": "refs.decision_point",
          "ext_field": "Request No.",
          "direction": "key",
          "note": "typed by M1 at Mark Approved"
        },
        {
          "portal_field": "gate.decision_point.submitted_at",
          "ext_field": "Submitted",
          "direction": "write",
          "note": ""
        },
        {
          "portal_field": "gate.decision_point.approved_at",
          "ext_field": "Decision date",
          "direction": "read",
          "note": "Decision Point is authoritative"
        }
      ],
      "stats": {
        "ok": 0,
        "failed": 0,
        "proposals": 0
      }
    },
    "smtp": {
      "label": "SMTP \u00b7 outbound mail",
      "kind": "service",
      "driver": "sim",
      "mode": "auto",
      "health": "ok",
      "last_sync_at": "2026-08-28",
      "note": "Simulated: every send lands in the P8 outbox."
    },
    "timeblock": {
      "label": "TimeBlock \u00b7 Gantt",
      "kind": "service",
      "driver": "sim",
      "mode": "auto",
      "health": "ok",
      "last_sync_at": "2026-08-28",
      "note": "Simulated: P5 timeline reads project phases directly."
    }
  },
  "gate_events_seed": [
    {
      "id": "GE001",
      "project_id": "WE26BGD0002",
      "system": "decision_point",
      "step": "submitted",
      "at": "2026-02-12",
      "actor": "priya",
      "source": "manual",
      "confidence": "authoritative",
      "ref": null,
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE002",
      "project_id": "WE26BGD0002",
      "system": "decision_point",
      "step": "approved",
      "at": "2026-02-26",
      "actor": "priya",
      "source": "manual",
      "confidence": "authoritative",
      "ref": null,
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE003",
      "project_id": "WE26BGD0002",
      "system": "chas",
      "step": "submitted",
      "at": "2026-02-12",
      "actor": "priya",
      "source": "manual",
      "confidence": "authoritative",
      "ref": null,
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE004",
      "project_id": "WE26HKG0001",
      "system": "decision_point",
      "step": "submitted",
      "at": "2026-02-18",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "DP-2026-0198",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE005",
      "project_id": "WE26HKG0001",
      "system": "decision_point",
      "step": "approved",
      "at": "2026-03-05",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "DP-2026-0198",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE006",
      "project_id": "WE26HKG0001",
      "system": "chas",
      "step": "submitted",
      "at": "2026-02-18",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "CHS-76540",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE007",
      "project_id": "WE26HKG0001",
      "system": "chas",
      "step": "approved",
      "at": "2026-03-12",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "CHS-76540",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE008",
      "project_id": "WE26HKG0002",
      "system": "decision_point",
      "step": "submitted",
      "at": "2026-08-24",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": null,
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE009",
      "project_id": "WE26HKG0004",
      "system": "decision_point",
      "step": "submitted",
      "at": "2026-07-30",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "DP-2026-0431",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE010",
      "project_id": "WE26HKG0004",
      "system": "decision_point",
      "step": "approved",
      "at": "2026-08-08",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "DP-2026-0431",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE011",
      "project_id": "WE26HKG0004",
      "system": "chas",
      "step": "submitted",
      "at": "2026-07-30",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "CHS-77690",
      "note": "backfilled from v1.0.4 gate dates"
    },
    {
      "id": "GE012",
      "project_id": "WE26HKG0004",
      "system": "chas",
      "step": "approved",
      "at": "2026-08-08",
      "actor": "admin",
      "source": "manual",
      "confidence": "authoritative",
      "ref": "CHS-77690",
      "note": "backfilled from v1.0.4 gate dates"
    }
  ],
  "contract_templates": [
    {
      "id": "T-UN",
      "name": "Corporate Agreement \u00b7 UN agency",
      "partner_type_scope": [
        "un"
      ],
      "country_scope": "all",
      "version": "2026.2",
      "status": "active",
      "tokens": [
        "{project_id}",
        "{project_name}",
        "{partner}",
        "{country}",
        "{amount_usd}",
        "{decision_point_ref}",
        "{chas_ref}",
        "{start_date}",
        "{end_date}"
      ],
      "clauses": [
        "Purpose",
        "Scope of work",
        "Funding and disbursement",
        "Reporting",
        "Branding and communication",
        "Data protection",
        "Anti-fraud and safeguarding",
        "Term and termination",
        "Signatures"
      ]
    },
    {
      "id": "T-INGO",
      "name": "Corporate Agreement \u00b7 International NGO",
      "partner_type_scope": [
        "ingo"
      ],
      "country_scope": "all",
      "version": "2026.2",
      "status": "active",
      "tokens": [
        "{project_id}",
        "{project_name}",
        "{partner}",
        "{country}",
        "{amount_usd}",
        "{decision_point_ref}",
        "{chas_ref}",
        "{start_date}",
        "{end_date}"
      ],
      "clauses": [
        "Purpose",
        "Scope of work",
        "Funding and disbursement",
        "Procurement",
        "Reporting",
        "Monitoring and evaluation",
        "Safeguarding",
        "Anti-fraud",
        "Term and termination",
        "Signatures"
      ]
    },
    {
      "id": "T-LOCAL",
      "name": "Corporate Agreement \u00b7 Local partner",
      "partner_type_scope": [
        "local"
      ],
      "country_scope": "all",
      "version": "2026.1",
      "status": "active",
      "tokens": [
        "{project_id}",
        "{project_name}",
        "{partner}",
        "{country}",
        "{amount_usd}",
        "{decision_point_ref}",
        "{chas_ref}",
        "{start_date}",
        "{end_date}"
      ],
      "clauses": [
        "Purpose",
        "Scope of work",
        "Funding and disbursement (tranches)",
        "Procurement",
        "Reporting",
        "Monitoring and evaluation",
        "Safeguarding",
        "Anti-fraud",
        "Local law compliance",
        "Term and termination",
        "Signatures"
      ]
    },
    {
      "id": "T-AMEND",
      "name": "Amendment to Corporate Agreement",
      "partner_type_scope": [
        "un",
        "ingo",
        "local"
      ],
      "country_scope": "all",
      "version": "2026.1",
      "status": "active",
      "tokens": [
        "{parent_contract_id}",
        "{amendment_no}",
        "{project_id}",
        "{partner}",
        "{change_summary}",
        "{amount_usd}"
      ],
      "clauses": [
        "Reference to original agreement",
        "Amended terms",
        "Effect on budget",
        "Signatures"
      ]
    }
  ],
  "signing_authority": [
    {
      "user_id": "admin",
      "role": "admin",
      "country_scope": "all",
      "min_usd": 0,
      "max_usd": null,
      "types": [
        "un",
        "ingo",
        "local",
        "amend"
      ]
    },
    {
      "user_id": "daniel",
      "role": "m2",
      "country_scope": "all",
      "min_usd": 0,
      "max_usd": 1000000,
      "types": [
        "un",
        "ingo",
        "local",
        "amend"
      ]
    },
    {
      "user_id": "priya",
      "role": "m1",
      "country_scope": [
        "BGD",
        "NPL",
        "IND"
      ],
      "min_usd": 0,
      "max_usd": 500000,
      "types": [
        "un",
        "ingo",
        "local",
        "amend"
      ]
    },
    {
      "user_id": "marco",
      "role": "m1",
      "country_scope": [
        "KHM",
        "MMR",
        "LAO"
      ],
      "min_usd": 0,
      "max_usd": 500000,
      "types": [
        "un",
        "ingo",
        "local",
        "amend"
      ]
    }
  ],
  "signing_delegations": [],
  "contracts": [
    {
      "id": "AS-0137",
      "project_id": "WE26HKG0001",
      "partner": "Hong Kong Red Cross",
      "partner_type": "local",
      "country": "HKG",
      "amount": 420000,
      "currency": "USD",
      "amount_usd": 420000,
      "status": "active",
      "template_id": "T-LOCAL",
      "version_no": 2,
      "versions": [
        {
          "no": 1,
          "at": "2026-03-02",
          "author": "daniel",
          "summary": "Initial draft from T-LOCAL"
        },
        {
          "no": 2,
          "at": "2026-03-09",
          "author": "daniel",
          "summary": "Finance: tranche schedule aligned to phases"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "approved",
          "due_at": "2026-03-07",
          "decided_at": "2026-03-06",
          "comment": "Standard terms"
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "approved",
          "due_at": "2026-03-07",
          "decided_at": "2026-03-09",
          "comment": "Tranches revised"
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "daniel",
          "name": null,
          "title": "Area Manager",
          "method": "click",
          "status": "signed",
          "signed_at": "2026-03-12",
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Ms. Carol Lam",
          "title": "Secretary General, HKRC",
          "method": "wet_ink",
          "status": "signed",
          "signed_at": "2026-03-16",
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-02-20",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [
        {
          "type": "report",
          "title": "Q3 narrative + financial report",
          "due_date": "2026-10-15",
          "owner": "anik",
          "status": "open"
        }
      ],
      "sent_at": "2026-03-17",
      "executed_at": "2026-03-16",
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0138",
      "project_id": "WE25NPL0007",
      "partner": "People's Development Foundation",
      "partner_type": "local",
      "country": "NPL",
      "amount": 292000,
      "currency": "USD",
      "amount_usd": 292000,
      "status": "active",
      "template_id": "T-LOCAL",
      "version_no": 1,
      "versions": [
        {
          "no": 1,
          "at": "2025-11-04",
          "author": "daniel",
          "summary": "Initial draft from T-LOCAL"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "approved",
          "due_at": "2025-11-10",
          "decided_at": "2025-11-08",
          "comment": ""
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "approved",
          "due_at": "2025-11-10",
          "decided_at": "2025-11-09",
          "comment": ""
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "priya",
          "name": null,
          "title": "Regional Manager \u00b7 South Asia",
          "method": "click",
          "status": "signed",
          "signed_at": "2025-11-12",
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Mr. Ram Thapa",
          "title": "Executive Director, PDF",
          "method": "wet_ink",
          "status": "signed",
          "signed_at": "2025-11-18",
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2025-10-28",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [
        {
          "type": "report",
          "title": "Final report",
          "due_date": "2026-12-31",
          "owner": "sunita",
          "status": "open"
        }
      ],
      "sent_at": "2025-11-19",
      "executed_at": "2025-11-18",
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0139",
      "project_id": "WE26IND0006",
      "partner": "Little Drops Old Age Home",
      "partner_type": "local",
      "country": "IND",
      "amount": 94200,
      "currency": "USD",
      "amount_usd": 94200,
      "status": "sent",
      "template_id": "T-LOCAL",
      "version_no": 1,
      "versions": [
        {
          "no": 1,
          "at": "2026-08-04",
          "author": "daniel",
          "summary": "Initial draft from T-LOCAL"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "approved",
          "due_at": "2026-08-11",
          "decided_at": "2026-08-08",
          "comment": ""
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "approved",
          "due_at": "2026-08-11",
          "decided_at": "2026-08-10",
          "comment": ""
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "priya",
          "name": null,
          "title": "Regional Manager \u00b7 South Asia",
          "method": "click",
          "status": "signed",
          "signed_at": "2026-08-14",
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Sr. Mary Joseph",
          "title": "Director, Little Drops",
          "method": "wet_ink",
          "status": "signed",
          "signed_at": "2026-08-22",
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-07-30",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [],
      "sent_at": "2026-08-26",
      "executed_at": "2026-08-22",
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0140",
      "project_id": "WE26MMR0004",
      "partner": "Myanmar Red Cross Society",
      "partner_type": "local",
      "country": "MMR",
      "amount": 505000,
      "currency": "USD",
      "amount_usd": 505000,
      "status": "amending",
      "template_id": "T-LOCAL",
      "version_no": 1,
      "versions": [
        {
          "no": 1,
          "at": "2026-02-10",
          "author": "daniel",
          "summary": "Initial draft from T-LOCAL"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "approved",
          "due_at": "2026-02-17",
          "decided_at": "2026-02-14",
          "comment": ""
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "approved",
          "due_at": "2026-02-17",
          "decided_at": "2026-02-16",
          "comment": ""
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "daniel",
          "name": null,
          "title": "Area Manager",
          "method": "click",
          "status": "signed",
          "signed_at": "2026-02-20",
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Dr. Myo Nyunt",
          "title": "President, MRCS",
          "method": "wet_ink",
          "status": "signed",
          "signed_at": "2026-02-27",
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-01-30",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [
        {
          "type": "report",
          "title": "Mid-term report",
          "due_date": "2026-09-30",
          "owner": "marco",
          "status": "open"
        }
      ],
      "sent_at": "2026-03-02",
      "executed_at": "2026-02-27",
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0141",
      "project_id": "WE26BGD0002",
      "partner": "CARE Bangladesh",
      "partner_type": "ingo",
      "country": "BGD",
      "amount": 760801,
      "currency": "USD",
      "amount_usd": 760801,
      "status": "draft",
      "template_id": "T-INGO",
      "version_no": 1,
      "versions": [
        {
          "no": 1,
          "at": "2026-08-20",
          "author": "daniel",
          "summary": "Early draft (gate open, CONTRACT_DRAFT_FROM=3)"
        }
      ],
      "reviews": [],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "daniel",
          "name": null,
          "title": "Area Manager",
          "method": "click",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Country Director, CARE Bangladesh",
          "title": "Country Director",
          "method": "wet_ink",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": false,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-08-18",
        "result": "clear"
      },
      "due_diligence": "pending",
      "obligations": [],
      "sent_at": null,
      "executed_at": null,
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0142",
      "project_id": "WE26IND0008",
      "partner": "Christian's Burial Ground Association",
      "partner_type": "local",
      "country": "IND",
      "amount": 260000,
      "currency": "USD",
      "amount_usd": 260000,
      "status": "in_review",
      "template_id": "T-LOCAL",
      "version_no": 2,
      "versions": [
        {
          "no": 1,
          "at": "2026-08-12",
          "author": "daniel",
          "summary": "Initial draft from T-LOCAL"
        },
        {
          "no": 2,
          "at": "2026-08-19",
          "author": "daniel",
          "summary": "Procurement clause per OGC pre-read"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "pending",
          "due_at": "2026-08-26",
          "decided_at": null,
          "comment": ""
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "approved",
          "due_at": "2026-08-26",
          "decided_at": "2026-08-24",
          "comment": "Budget matches CHaS ref"
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "priya",
          "name": null,
          "title": "Regional Manager \u00b7 South Asia",
          "method": "click",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Rev. Samuel Prakash",
          "title": "Chairman, CBGA",
          "method": "wet_ink",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-08-05",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [],
      "sent_at": null,
      "executed_at": null,
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0143",
      "project_id": "WE26KHM0003",
      "partner": "Khmer-Soviet Friendship Hospital",
      "partner_type": "local",
      "country": "KHM",
      "amount": 612000,
      "currency": "USD",
      "amount_usd": 612000,
      "status": "signing",
      "template_id": "T-LOCAL",
      "version_no": 3,
      "versions": [
        {
          "no": 1,
          "at": "2026-07-21",
          "author": "daniel",
          "summary": "Initial draft from T-LOCAL"
        },
        {
          "no": 2,
          "at": "2026-07-29",
          "author": "daniel",
          "summary": "OGC: equipment title clause"
        },
        {
          "no": 3,
          "at": "2026-08-05",
          "author": "daniel",
          "summary": "Finance: disbursement in 3 tranches"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "approved",
          "due_at": "2026-08-01",
          "decided_at": "2026-07-31",
          "comment": ""
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "approved",
          "due_at": "2026-08-01",
          "decided_at": "2026-08-06",
          "comment": ""
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "marco",
          "name": null,
          "title": "Regional Manager \u00b7 Mekong",
          "method": "click",
          "status": "signed",
          "signed_at": "2026-08-19",
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "church",
          "user_id": "daniel",
          "name": null,
          "title": "Area Manager",
          "method": "click",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        },
        {
          "order_index": 3,
          "party": "partner",
          "user_id": null,
          "name": "Dr. Sok Vanna",
          "title": "Hospital Director",
          "method": "wet_ink",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-07-15",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [],
      "sent_at": null,
      "executed_at": null,
      "parent_contract_id": null,
      "amendment_no": 0,
      "log_ids": []
    },
    {
      "id": "AS-0144",
      "project_id": "WE26MMR0004",
      "partner": "Myanmar Red Cross Society",
      "partner_type": "local",
      "country": "MMR",
      "amount": 505000,
      "currency": "USD",
      "amount_usd": 505000,
      "status": "in_review",
      "template_id": "T-AMEND",
      "version_no": 1,
      "versions": [
        {
          "no": 1,
          "at": "2026-08-21",
          "author": "daniel",
          "summary": "Amendment 1: extend end date to 2027-03-31, no budget change"
        }
      ],
      "reviews": [
        {
          "division": "ogc",
          "order_index": 1,
          "assignee": "elena",
          "status": "pending",
          "due_at": "2026-08-28",
          "decided_at": null,
          "comment": ""
        },
        {
          "division": "finance",
          "order_index": 1,
          "assignee": "rafael",
          "status": "pending",
          "due_at": "2026-08-28",
          "decided_at": null,
          "comment": ""
        }
      ],
      "signatories": [
        {
          "order_index": 1,
          "party": "church",
          "user_id": "daniel",
          "name": null,
          "title": "Area Manager",
          "method": "click",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        },
        {
          "order_index": 2,
          "party": "partner",
          "user_id": null,
          "name": "Dr. Myo Nyunt",
          "title": "President, MRCS",
          "method": "wet_ink",
          "status": "pending",
          "signed_at": null,
          "authority_ok": true
        }
      ],
      "attestations": {
        "supplements_local": true,
        "no_dependency": true,
        "not_primary_support": true,
        "partner_verified": true
      },
      "screening": {
        "date": "2026-01-30",
        "result": "clear"
      },
      "due_diligence": "verified",
      "obligations": [],
      "sent_at": null,
      "executed_at": null,
      "parent_contract_id": "AS-0140",
      "amendment_no": 1,
      "log_ids": []
    }
  ],
  "contract_seq": 145,
  "dev_stages": {
    "WE26BGD0003": {
      "released": false,
      "released_by": null,
      "released_at": null,
      "stages": {
        "assessment": {
          "status": "done",
          "note": "Two sites visited with the WFP field officer; kitchen block at Site B needs a roof before the monsoon.",
          "updated_by": "anik",
          "updated_at": "2026-08-18",
          "observations": [
            {
              "id": "ob1",
              "text": "Site A: 640 enrolled pupils, attendance drops to ~55% in the lean months (March\u2013May)."
            },
            {
              "id": "ob2",
              "text": "Site B: kitchen block has no roof; cooking currently happens under a tarpaulin."
            },
            {
              "id": "ob3",
              "text": "WFP already supplies fortified rice to 3 nearby schools; no overlap with these two."
            }
          ],
          "justification": "A daily hot meal is the single intervention the head teachers and the union parishad both asked for; it supplements the government stipend without replacing it.",
          "images": [
            {
              "id": "im4",
              "name": "site-a-compound.png",
              "caption": "Site A \u2014 school compound, August visit",
              "data": "data:image/png;base64,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"
            },
            {
              "id": "im5",
              "name": "site-b-kitchen.png",
              "caption": "Site B \u2014 kitchen block without a roof",
              "data": "data:image/png;base64,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"
            }
          ],
          "draft": null,
          "docs": [],
          "links": [],
          "comments": []
        },
        "concept": {
          "status": "inprogress",
          "note": "Pre-draft generated; objectives reworded after the specialist call.",
          "updated_by": "anik",
          "updated_at": "2026-08-24",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": {
            "generated_at": "2026-08-24",
            "by": "anik",
            "sections": [
              {
                "key": "summary",
                "title": "Title & summary",
                "html": "<p>WFP \u2014 School Feeding (WE26BGD0003) is a project proposed for Bangladesh in the 2026 budget year, requesting $300,000.</p>",
                "generated_html": "<p>WFP \u2014 School Feeding (WE26BGD0003) is a project proposed for Bangladesh in the 2026 budget year, requesting $300,000.</p>",
                "edited": false
              },
              {
                "key": "background",
                "title": "Background & need",
                "html": "<p>The assessment recorded the following observations:</p><ul><li>Site A: 640 enrolled pupils, attendance drops to ~55% in the lean months (March\u2013May).</li><li>Site B: kitchen block has no roof; cooking currently happens under a tarpaulin.</li><li>WFP already supplies fortified rice to 3 nearby schools; no overlap with these two.</li></ul><h3>Justification</h3><p>A daily hot meal is the single intervention the head teachers and the union parishad both asked for; it supplements the government stipend without replacing it.</p>",
                "generated_html": "<p>The assessment recorded the following observations:</p><ul><li>Site A: 640 enrolled pupils, attendance drops to ~55% in the lean months (March\u2013May).</li><li>Site B: kitchen block has no roof; cooking currently happens under a tarpaulin.</li><li>WFP already supplies fortified rice to 3 nearby schools; no overlap with these two.</li></ul><h3>Justification</h3><p>A daily hot meal is the single intervention the head teachers and the union parishad both asked for; it supplements the government stipend without replacing it.</p>",
                "edited": false
              },
              {
                "key": "objectives",
                "title": "Objectives",
                "html": "<ul><li>Provide one hot meal on every school day to 1,180 pupils at two schools.</li><li>Raise lean-season attendance above 80% at both sites by the end of the school year.</li><li>Hand the kitchens over to the school management committees with no continuing dependency on Church funds.</li></ul>",
                "generated_html": "<ul><li>Address the need identified in the assessment.</li><li>Deliver the planned activities within the 2026 budget year and the country ceiling.</li><li>Hand over to WFP with no continuing dependency on Church funds.</li></ul>",
                "edited": true
              },
              {
                "key": "activities",
                "title": "Key activities",
                "html": "<ul><li>Mobilise the implementing partner and confirm the site.</li><li>Procure and deliver the planned inputs.</li><li>Monitor delivery and report to the Area office.</li></ul>",
                "generated_html": "<ul><li>Mobilise the implementing partner and confirm the site.</li><li>Procure and deliver the planned inputs.</li><li>Monitor delivery and report to the Area office.</li></ul>",
                "edited": false
              },
              {
                "key": "beneficiaries",
                "title": "Beneficiaries & location",
                "html": "<p>Location: Bangladesh.</p><p>Beneficiaries: to be confirmed from the assessment (see Background &amp; need).</p>",
                "generated_html": "<p>Location: Bangladesh.</p><p>Beneficiaries: to be confirmed from the assessment (see Background &amp; need).</p>",
                "edited": false
              },
              {
                "key": "partner",
                "title": "Implementing partner",
                "html": "<p>Implementing partner: WFP.</p>",
                "generated_html": "<p>Implementing partner: WFP.</p>",
                "edited": false
              },
              {
                "key": "budget",
                "title": "Budget summary",
                "html": "<ul><li>Requested: $300,000</li><li>Budget year: 2026</li></ul>",
                "generated_html": "<ul><li>Requested: $300,000</li><li>Budget year: 2026</li></ul>",
                "edited": false
              },
              {
                "key": "timeline",
                "title": "Timeline",
                "html": "<p>Planned window: 1 Jan 26 \u2192 15 Sep 26.</p>",
                "generated_html": "<p>Planned window: 1 Jan 26 \u2192 15 Sep 26.</p>",
                "edited": false
              },
              {
                "key": "risks",
                "title": "Risks & assumptions",
                "html": "<ul><li>Partner capacity and procurement lead times.</li><li>Access and seasonal constraints at the site.</li><li>Assumes the requested $300,000 is confirmed for the 2026 budget year at approval.</li></ul>",
                "generated_html": "<ul><li>Partner capacity and procurement lead times.</li><li>Access and seasonal constraints at the site.</li><li>Assumes the requested $300,000 is confirmed for the 2026 budget year at approval.</li></ul>",
                "edited": false
              }
            ]
          },
          "docs": [
            {
              "id": "doc-WE26BGD0003-concept-6",
              "kind": "concept",
              "title": "Project Concept Draft \u2014 WFP \u2014 School Feeding",
              "at": "2026-08-24",
              "by": "anik",
              "model": {
                "id": "doc-WE26BGD0003-concept-6",
                "kind": "concept",
                "kindLabel": "Project Concept Draft",
                "title": "Project Concept Draft \u2014 WFP \u2014 School Feeding",
                "subtitle": "WE26BGD0003 \u00b7 Bangladesh \u00b7 $300,000",
                "meta": [
                  [
                    "Project",
                    "WE26BGD0003 \u00b7 WFP \u2014 School Feeding"
                  ],
                  [
                    "Country",
                    "Bangladesh"
                  ],
                  [
                    "Requested",
                    "$300,000"
                  ],
                  [
                    "Owner",
                    "Anik R."
                  ],
                  [
                    "Status",
                    "In development"
                  ],
                  [
                    "Target date",
                    "15 Sep 26"
                  ],
                  [
                    "Implementing partner",
                    "WFP"
                  ]
                ],
                "generated_at": "2026-08-24",
                "by": "anik",
                "sections": [
                  {
                    "key": "summary",
                    "heading": "Title & summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "WFP \u2014 School Feeding (WE26BGD0003) is a project proposed for Bangladesh in the 2026 budget year, requesting $300,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Background & need",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Site A: 640 enrolled pupils, attendance drops to ~55% in the lean months (March\u2013May)."
                            }
                          ],
                          [
                            {
                              "text": "Site B: kitchen block has no roof; cooking currently happens under a tarpaulin."
                            }
                          ],
                          [
                            {
                              "text": "WFP already supplies fortified rice to 3 nearby schools; no overlap with these two."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "A daily hot meal is the single intervention the head teachers and the union parishad both asked for; it supplements the government stipend without replacing it."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "objectives",
                    "heading": "Objectives",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Provide one hot meal on every school day to 1,180 pupils at two schools."
                            }
                          ],
                          [
                            {
                              "text": "Raise lean-season attendance above 80% at both sites by the end of the school year."
                            }
                          ],
                          [
                            {
                              "text": "Hand the kitchens over to the school management committees with no continuing dependency on Church funds."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "activities",
                    "heading": "Key activities",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Mobilise the implementing partner and confirm the site."
                            }
                          ],
                          [
                            {
                              "text": "Procure and deliver the planned inputs."
                            }
                          ],
                          [
                            {
                              "text": "Monitor delivery and report to the Area office."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "beneficiaries",
                    "heading": "Beneficiaries & location",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Location: Bangladesh."
                          }
                        ]
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Beneficiaries: to be confirmed from the assessment (see Background & need)."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "partner",
                    "heading": "Implementing partner",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Implementing partner: WFP."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $300,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "timeline",
                    "heading": "Timeline",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Planned window: 1 Jan 26 \u2192 15 Sep 26."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "risks",
                    "heading": "Risks & assumptions",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Partner capacity and procurement lead times."
                            }
                          ],
                          [
                            {
                              "text": "Access and seasonal constraints at the site."
                            }
                          ],
                          [
                            {
                              "text": "Assumes the requested $300,000 is confirmed for the 2026 budget year at approval."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "appendix",
                    "heading": "Appendix \u2014 Assessment images",
                    "blocks": [
                      {
                        "t": "img",
                        "data": "data:image/png;base64,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",
                        "caption": "Site A \u2014 school compound, August visit"
                      },
                      {
                        "t": "img",
                        "data": "data:image/png;base64,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",
                        "caption": "Site B \u2014 kitchen block without a roof"
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26BGD0003-concept-7",
              "audience": "specialist",
              "doc_id": "doc-WE26BGD0003-concept-6",
              "created_at": "2026-08-24",
              "by": "anik",
              "active": true
            }
          ],
          "comments": [
            {
              "id": "rc8",
              "at": "2026-08-26",
              "email": "s.rahman@example.org",
              "name": "S. Rahman",
              "body": "The attendance figures should cite the 2025 EMIS baseline, and the kitchen roof at Site B belongs in Key activities, not only in the background.",
              "via": "rv-WE26BGD0003-concept-7",
              "doc_id": "doc-WE26BGD0003-concept-6"
            }
          ],
          "mails": [
            {
              "at": "2026-08-24",
              "by": "anik",
              "to": [
                "s.rahman@example.org"
              ],
              "subject": "Review request: Project Concept Draft \u2014 WE26BGD0003 WFP \u2014 School Feeding",
              "reply_to": "dev-concept-WE26BGD0003@portal.example.org",
              "token": "rv-WE26BGD0003-concept-7"
            }
          ]
        },
        "orgcheck": {
          "status": "notstarted",
          "note": "",
          "updated_by": null,
          "updated_at": null,
          "observations": [],
          "justification": "",
          "images": [],
          "draft": null,
          "docs": [],
          "links": [],
          "comments": []
        },
        "areacomm": {
          "status": "notstarted",
          "note": "",
          "updated_by": null,
          "updated_at": null,
          "observations": [],
          "justification": "",
          "images": [],
          "draft": null,
          "docs": [],
          "links": [],
          "comments": []
        }
      }
    },
    "WE26NPL0011": {
      "released": false,
      "released_by": null,
      "released_at": null,
      "stages": {
        "assessment": {
          "status": "done",
          "note": "Field visit to Humla and Jumla completed with the district officers.",
          "updated_by": "sunita",
          "updated_at": "2026-08-05",
          "observations": [
            {
              "id": "ob9",
              "text": "Humla: 420 households above 3,000 m with no winter fuel stock; last winter 3 cold-related deaths reported."
            },
            {
              "id": "ob10",
              "text": "Jumla: district warehouse can hold 600 kits; road access closes by mid-November."
            }
          ],
          "justification": "Winterisation kits must be pre-positioned before the road closure; the district budget covers fuel only.",
          "images": [],
          "draft": null,
          "docs": [],
          "links": [],
          "comments": []
        },
        "concept": {
          "status": "done",
          "note": "Draft reviewed by the specialist; two comments folded in.",
          "updated_by": "sunita",
          "updated_at": "2026-08-12",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": {
            "generated_at": "2026-08-10",
            "by": "sunita",
            "sections": [
              {
                "key": "summary",
                "title": "Title & summary",
                "html": "<p>Winterisation Support (WE26NPL0011) is a project proposed for Nepal in the 2026 budget year, requesting $400,000.</p>",
                "generated_html": "<p>Winterisation Support (WE26NPL0011) is a project proposed for Nepal in the 2026 budget year, requesting $400,000.</p>",
                "edited": false
              },
              {
                "key": "background",
                "title": "Background & need",
                "html": "<p>The assessment recorded the following observations:</p><ul><li>Humla: 420 households above 3,000 m with no winter fuel stock; last winter 3 cold-related deaths reported.</li><li>Jumla: district warehouse can hold 600 kits; road access closes by mid-November.</li></ul><h3>Justification</h3><p>Winterisation kits must be pre-positioned before the road closure; the district budget covers fuel only.</p>",
                "generated_html": "<p>The assessment recorded the following observations:</p><ul><li>Humla: 420 households above 3,000 m with no winter fuel stock; last winter 3 cold-related deaths reported.</li><li>Jumla: district warehouse can hold 600 kits; road access closes by mid-November.</li></ul><h3>Justification</h3><p>Winterisation kits must be pre-positioned before the road closure; the district budget covers fuel only.</p>",
                "edited": false
              },
              {
                "key": "objectives",
                "title": "Objectives",
                "html": "<ul><li>Address the need identified in the assessment.</li><li>Deliver the planned activities within the 2026 budget year and the country ceiling.</li><li>Hand over to the implementing partner with no continuing dependency on Church funds.</li></ul>",
                "generated_html": "<ul><li>Address the need identified in the assessment.</li><li>Deliver the planned activities within the 2026 budget year and the country ceiling.</li><li>Hand over to the implementing partner with no continuing dependency on Church funds.</li></ul>",
                "edited": false
              },
              {
                "key": "activities",
                "title": "Key activities",
                "html": "<ul><li>Mobilise the implementing partner and confirm the site.</li><li>Procure and deliver the planned inputs.</li><li>Monitor delivery and report to the Area office.</li></ul>",
                "generated_html": "<ul><li>Mobilise the implementing partner and confirm the site.</li><li>Procure and deliver the planned inputs.</li><li>Monitor delivery and report to the Area office.</li></ul>",
                "edited": false
              },
              {
                "key": "beneficiaries",
                "title": "Beneficiaries & location",
                "html": "<p>Location: Nepal.</p><p>Beneficiaries: to be confirmed from the assessment (see Background &amp; need).</p>",
                "generated_html": "<p>Location: Nepal.</p><p>Beneficiaries: to be confirmed from the assessment (see Background &amp; need).</p>",
                "edited": false
              },
              {
                "key": "partner",
                "title": "Implementing partner",
                "html": "<p>Implementing partner: not yet named.</p>",
                "generated_html": "<p>Implementing partner: not yet named.</p>",
                "edited": false
              },
              {
                "key": "budget",
                "title": "Budget summary",
                "html": "<ul><li>Requested: $400,000</li><li>Budget year: 2026</li></ul>",
                "generated_html": "<ul><li>Requested: $400,000</li><li>Budget year: 2026</li></ul>",
                "edited": false
              },
              {
                "key": "timeline",
                "title": "Timeline",
                "html": "<p>Planned window: 1 Jan 26 \u2192 30 Oct 26.</p>",
                "generated_html": "<p>Planned window: 1 Jan 26 \u2192 30 Oct 26.</p>",
                "edited": false
              },
              {
                "key": "risks",
                "title": "Risks & assumptions",
                "html": "<ul><li>Partner capacity and procurement lead times.</li><li>Access and seasonal constraints at the site.</li><li>Assumes the requested $400,000 is confirmed for the 2026 budget year at approval.</li></ul>",
                "generated_html": "<ul><li>Partner capacity and procurement lead times.</li><li>Access and seasonal constraints at the site.</li><li>Assumes the requested $400,000 is confirmed for the 2026 budget year at approval.</li></ul>",
                "edited": false
              }
            ]
          },
          "docs": [
            {
              "id": "doc-WE26NPL0011-concept-11",
              "kind": "concept",
              "title": "Project Concept Draft \u2014 Winterisation Support",
              "at": "2026-08-10",
              "by": "sunita",
              "model": {
                "id": "doc-WE26NPL0011-concept-11",
                "kind": "concept",
                "kindLabel": "Project Concept Draft",
                "title": "Project Concept Draft \u2014 Winterisation Support",
                "subtitle": "WE26NPL0011 \u00b7 Nepal \u00b7 $400,000",
                "meta": [
                  [
                    "Project",
                    "WE26NPL0011 \u00b7 Winterisation Support"
                  ],
                  [
                    "Country",
                    "Nepal"
                  ],
                  [
                    "Requested",
                    "$400,000"
                  ],
                  [
                    "Owner",
                    "Sunita M."
                  ],
                  [
                    "Status",
                    "In development"
                  ],
                  [
                    "Target date",
                    "30 Oct 26"
                  ]
                ],
                "generated_at": "2026-08-10",
                "by": "sunita",
                "sections": [
                  {
                    "key": "summary",
                    "heading": "Title & summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Winterisation Support (WE26NPL0011) is a project proposed for Nepal in the 2026 budget year, requesting $400,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Background & need",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Humla: 420 households above 3,000 m with no winter fuel stock; last winter 3 cold-related deaths reported."
                            }
                          ],
                          [
                            {
                              "text": "Jumla: district warehouse can hold 600 kits; road access closes by mid-November."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Winterisation kits must be pre-positioned before the road closure; the district budget covers fuel only."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "objectives",
                    "heading": "Objectives",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Address the need identified in the assessment."
                            }
                          ],
                          [
                            {
                              "text": "Deliver the planned activities within the 2026 budget year and the country ceiling."
                            }
                          ],
                          [
                            {
                              "text": "Hand over to the implementing partner with no continuing dependency on Church funds."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "activities",
                    "heading": "Key activities",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Mobilise the implementing partner and confirm the site."
                            }
                          ],
                          [
                            {
                              "text": "Procure and deliver the planned inputs."
                            }
                          ],
                          [
                            {
                              "text": "Monitor delivery and report to the Area office."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "beneficiaries",
                    "heading": "Beneficiaries & location",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Location: Nepal."
                          }
                        ]
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Beneficiaries: to be confirmed from the assessment (see Background & need)."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "partner",
                    "heading": "Implementing partner",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Implementing partner: not yet named."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $400,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "timeline",
                    "heading": "Timeline",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Planned window: 1 Jan 26 \u2192 30 Oct 26."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "risks",
                    "heading": "Risks & assumptions",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Partner capacity and procurement lead times."
                            }
                          ],
                          [
                            {
                              "text": "Access and seasonal constraints at the site."
                            }
                          ],
                          [
                            {
                              "text": "Assumes the requested $400,000 is confirmed for the 2026 budget year at approval."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26NPL0011-concept-12",
              "audience": "specialist",
              "doc_id": "doc-WE26NPL0011-concept-11",
              "created_at": "2026-08-10",
              "by": "sunita",
              "active": false,
              "revoked_at": "2026-08-10",
              "revoked_by": "sunita"
            }
          ],
          "comments": []
        },
        "orgcheck": {
          "status": "done",
          "note": "HQ returned a clear background check on the partner.",
          "updated_by": "priya",
          "updated_at": "2026-08-20",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": null,
          "docs": [
            {
              "id": "doc-WE26NPL0011-orgcheck-13",
              "kind": "orgpack",
              "title": "Organisation Background Check \u2014 Project Information Pack \u2014 Winterisation Support",
              "at": "2026-08-14",
              "by": "sunita",
              "model": {
                "id": "doc-WE26NPL0011-orgcheck-13",
                "kind": "orgpack",
                "kindLabel": "Organisation Background Check \u2014 Project Information Pack",
                "title": "Organisation Background Check \u2014 Project Information Pack \u2014 Winterisation Support",
                "subtitle": "WE26NPL0011 \u00b7 Nepal \u00b7 $400,000",
                "meta": [
                  [
                    "Project",
                    "WE26NPL0011 \u00b7 Winterisation Support"
                  ],
                  [
                    "Country",
                    "Nepal"
                  ],
                  [
                    "Requested",
                    "$400,000"
                  ],
                  [
                    "Owner",
                    "Sunita M."
                  ],
                  [
                    "Status",
                    "In development"
                  ],
                  [
                    "Target date",
                    "30 Oct 26"
                  ]
                ],
                "generated_at": "2026-08-14",
                "by": "sunita",
                "sections": [
                  {
                    "key": "purpose",
                    "heading": "Purpose of this pack",
                    "blocks": [
                      {
                        "t": "p",
                        "text": "Information pack for the organisation background check of the implementing partner, prepared for HQ review."
                      }
                    ]
                  },
                  {
                    "key": "record",
                    "heading": "Project record",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Project id",
                            "WE26NPL0011"
                          ],
                          [
                            "Name",
                            "Winterisation Support"
                          ],
                          [
                            "Country",
                            "Nepal"
                          ],
                          [
                            "Requested",
                            "$400,000"
                          ],
                          [
                            "Owner",
                            "Sunita M."
                          ],
                          [
                            "Implementing partner",
                            "not yet named"
                          ],
                          [
                            "Strategic priority",
                            "\u2014"
                          ],
                          [
                            "Classification",
                            "\u2014"
                          ],
                          [
                            "Target date",
                            "30 Oct 26"
                          ]
                        ]
                      }
                    ]
                  },
                  {
                    "key": "summary",
                    "heading": "Summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Winterisation Support (WE26NPL0011) is a project proposed for Nepal in the 2026 budget year, requesting $400,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Assessment findings",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Humla: 420 households above 3,000 m with no winter fuel stock; last winter 3 cold-related deaths reported."
                            }
                          ],
                          [
                            {
                              "text": "Jumla: district warehouse can hold 600 kits; road access closes by mid-November."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Winterisation kits must be pre-positioned before the road closure; the district budget covers fuel only."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "partner",
                    "heading": "Implementing partner",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Implementing partner: not yet named."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "checks",
                    "heading": "Checks requested",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          "Legal registration and governance of the partner",
                          "Sanctions and due-diligence screening",
                          "Track record with comparable projects",
                          "Financial controls and reporting capacity"
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $400,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "stages",
                    "heading": "Development stages",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Assessment",
                            "Done"
                          ],
                          [
                            "Project Concept",
                            "Done"
                          ],
                          [
                            "Org Background check",
                            "Done"
                          ],
                          [
                            "Area Humane Society Communication",
                            "Done"
                          ]
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26NPL0011-orgcheck-14",
              "audience": "hq",
              "doc_id": "doc-WE26NPL0011-orgcheck-13",
              "created_at": "2026-08-14",
              "by": "sunita",
              "active": true
            }
          ],
          "comments": [],
          "mails": [
            {
              "at": "2026-08-14",
              "by": "sunita",
              "to": [
                "humanitarian-review@hq.example.org"
              ],
              "subject": "Review request: Organisation Background Check \u2014 WE26NPL0011 Winterisation Support",
              "reply_to": "dev-orgcheck-WE26NPL0011@portal.example.org",
              "token": "rv-WE26NPL0011-orgcheck-14"
            }
          ]
        },
        "areacomm": {
          "status": "done",
          "note": "Area Humane Society confirmed no overlap in the two districts.",
          "updated_by": "daniel",
          "updated_at": "2026-08-26",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": null,
          "docs": [
            {
              "id": "doc-WE26NPL0011-areacomm-15",
              "kind": "areapack",
              "title": "Area Humane Society Communication \u2014 Project Information Pack \u2014 Winterisation Support",
              "at": "2026-08-21",
              "by": "sunita",
              "model": {
                "id": "doc-WE26NPL0011-areacomm-15",
                "kind": "areapack",
                "kindLabel": "Area Humane Society Communication \u2014 Project Information Pack",
                "title": "Area Humane Society Communication \u2014 Project Information Pack \u2014 Winterisation Support",
                "subtitle": "WE26NPL0011 \u00b7 Nepal \u00b7 $400,000",
                "meta": [
                  [
                    "Project",
                    "WE26NPL0011 \u00b7 Winterisation Support"
                  ],
                  [
                    "Country",
                    "Nepal"
                  ],
                  [
                    "Requested",
                    "$400,000"
                  ],
                  [
                    "Owner",
                    "Sunita M."
                  ],
                  [
                    "Status",
                    "In development"
                  ],
                  [
                    "Target date",
                    "30 Oct 26"
                  ]
                ],
                "generated_at": "2026-08-21",
                "by": "sunita",
                "sections": [
                  {
                    "key": "purpose",
                    "heading": "Purpose of this pack",
                    "blocks": [
                      {
                        "t": "p",
                        "text": "Information pack for the Area Humane Society communication, prepared for the Area office."
                      }
                    ]
                  },
                  {
                    "key": "record",
                    "heading": "Project record",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Project id",
                            "WE26NPL0011"
                          ],
                          [
                            "Name",
                            "Winterisation Support"
                          ],
                          [
                            "Country",
                            "Nepal"
                          ],
                          [
                            "Requested",
                            "$400,000"
                          ],
                          [
                            "Owner",
                            "Sunita M."
                          ],
                          [
                            "Implementing partner",
                            "not yet named"
                          ],
                          [
                            "Strategic priority",
                            "\u2014"
                          ],
                          [
                            "Classification",
                            "\u2014"
                          ],
                          [
                            "Target date",
                            "30 Oct 26"
                          ]
                        ]
                      }
                    ]
                  },
                  {
                    "key": "summary",
                    "heading": "Summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Winterisation Support (WE26NPL0011) is a project proposed for Nepal in the 2026 budget year, requesting $400,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Assessment findings",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Humla: 420 households above 3,000 m with no winter fuel stock; last winter 3 cold-related deaths reported."
                            }
                          ],
                          [
                            {
                              "text": "Jumla: district warehouse can hold 600 kits; road access closes by mid-November."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Winterisation kits must be pre-positioned before the road closure; the district budget covers fuel only."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "activities",
                    "heading": "Planned activities",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Mobilise the implementing partner and confirm the site."
                            }
                          ],
                          [
                            {
                              "text": "Procure and deliver the planned inputs."
                            }
                          ],
                          [
                            {
                              "text": "Monitor delivery and report to the Area office."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "coordination",
                    "heading": "Coordination with the Area Humane Society",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          "Confirm no duplication with Society programmes in Nepal",
                          "Agree the communication line for beneficiaries and local authorities",
                          "Share the timeline and the point of contact (Sunita M.)"
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $400,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "stages",
                    "heading": "Development stages",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Assessment",
                            "Done"
                          ],
                          [
                            "Project Concept",
                            "Done"
                          ],
                          [
                            "Org Background check",
                            "Done"
                          ],
                          [
                            "Area Humane Society Communication",
                            "Done"
                          ]
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26NPL0011-areacomm-16",
              "audience": "area",
              "doc_id": "doc-WE26NPL0011-areacomm-15",
              "created_at": "2026-08-21",
              "by": "sunita",
              "active": true
            }
          ],
          "comments": []
        }
      }
    },
    "WE26BGD0005": {
      "released": true,
      "released_by": "priya",
      "released_at": "2026-08-27",
      "stages": {
        "assessment": {
          "status": "done",
          "note": "Kit specification agreed with the local partner.",
          "updated_by": "daniel",
          "updated_at": "2026-08-06",
          "observations": [
            {
              "id": "ob17",
              "text": "Cyclone-affected chars: 2,400 households in temporary shelter, 900 with no roofing sheet."
            },
            {
              "id": "ob18",
              "text": "Local partner has a warehouse at the upazila and a delivery record from 2025."
            }
          ],
          "justification": "Shelter kits before the monsoon peak; unit cost $50 sits within the $250,000 envelope.",
          "images": [],
          "draft": null,
          "docs": [],
          "links": [],
          "comments": []
        },
        "concept": {
          "status": "done",
          "note": "Concept draft reviewed by the specialist.",
          "updated_by": "daniel",
          "updated_at": "2026-08-13",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": {
            "generated_at": "2026-08-11",
            "by": "daniel",
            "sections": [
              {
                "key": "summary",
                "title": "Title & summary",
                "html": "<p>Emergency Shelter Kits (WE26BGD0005) is a project proposed for Bangladesh in the 2026 budget year, requesting $250,000.</p>",
                "generated_html": "<p>Emergency Shelter Kits (WE26BGD0005) is a project proposed for Bangladesh in the 2026 budget year, requesting $250,000.</p>",
                "edited": false
              },
              {
                "key": "background",
                "title": "Background & need",
                "html": "<p>The assessment recorded the following observations:</p><ul><li>Cyclone-affected chars: 2,400 households in temporary shelter, 900 with no roofing sheet.</li><li>Local partner has a warehouse at the upazila and a delivery record from 2025.</li></ul><h3>Justification</h3><p>Shelter kits before the monsoon peak; unit cost $50 sits within the $250,000 envelope.</p>",
                "generated_html": "<p>The assessment recorded the following observations:</p><ul><li>Cyclone-affected chars: 2,400 households in temporary shelter, 900 with no roofing sheet.</li><li>Local partner has a warehouse at the upazila and a delivery record from 2025.</li></ul><h3>Justification</h3><p>Shelter kits before the monsoon peak; unit cost $50 sits within the $250,000 envelope.</p>",
                "edited": false
              },
              {
                "key": "objectives",
                "title": "Objectives",
                "html": "<ul><li>Address the need identified in the assessment.</li><li>Deliver the planned activities within the 2026 budget year and the country ceiling.</li><li>Hand over to Local partner with no continuing dependency on Church funds.</li></ul>",
                "generated_html": "<ul><li>Address the need identified in the assessment.</li><li>Deliver the planned activities within the 2026 budget year and the country ceiling.</li><li>Hand over to Local partner with no continuing dependency on Church funds.</li></ul>",
                "edited": false
              },
              {
                "key": "activities",
                "title": "Key activities",
                "html": "<ul><li>Mobilise the implementing partner and confirm the site.</li><li>Procure and deliver the planned inputs.</li><li>Monitor delivery and report to the Area office.</li></ul>",
                "generated_html": "<ul><li>Mobilise the implementing partner and confirm the site.</li><li>Procure and deliver the planned inputs.</li><li>Monitor delivery and report to the Area office.</li></ul>",
                "edited": false
              },
              {
                "key": "beneficiaries",
                "title": "Beneficiaries & location",
                "html": "<p>Location: Bangladesh.</p><p>Beneficiaries: to be confirmed from the assessment (see Background &amp; need).</p>",
                "generated_html": "<p>Location: Bangladesh.</p><p>Beneficiaries: to be confirmed from the assessment (see Background &amp; need).</p>",
                "edited": false
              },
              {
                "key": "partner",
                "title": "Implementing partner",
                "html": "<p>Implementing partner: Local partner.</p>",
                "generated_html": "<p>Implementing partner: Local partner.</p>",
                "edited": false
              },
              {
                "key": "budget",
                "title": "Budget summary",
                "html": "<ul><li>Requested: $250,000</li><li>Budget year: 2026</li></ul>",
                "generated_html": "<ul><li>Requested: $250,000</li><li>Budget year: 2026</li></ul>",
                "edited": false
              },
              {
                "key": "timeline",
                "title": "Timeline",
                "html": "<p>Planned window: 1 Jan 26 \u2192 31 Aug 26.</p>",
                "generated_html": "<p>Planned window: 1 Jan 26 \u2192 31 Aug 26.</p>",
                "edited": false
              },
              {
                "key": "risks",
                "title": "Risks & assumptions",
                "html": "<ul><li>Partner capacity and procurement lead times.</li><li>Access and seasonal constraints at the site.</li><li>Assumes the requested $250,000 is confirmed for the 2026 budget year at approval.</li></ul>",
                "generated_html": "<ul><li>Partner capacity and procurement lead times.</li><li>Access and seasonal constraints at the site.</li><li>Assumes the requested $250,000 is confirmed for the 2026 budget year at approval.</li></ul>",
                "edited": false
              }
            ]
          },
          "docs": [
            {
              "id": "doc-WE26BGD0005-concept-19",
              "kind": "concept",
              "title": "Project Concept Draft \u2014 Emergency Shelter Kits",
              "at": "2026-08-11",
              "by": "daniel",
              "model": {
                "id": "doc-WE26BGD0005-concept-19",
                "kind": "concept",
                "kindLabel": "Project Concept Draft",
                "title": "Project Concept Draft \u2014 Emergency Shelter Kits",
                "subtitle": "WE26BGD0005 \u00b7 Bangladesh \u00b7 $250,000",
                "meta": [
                  [
                    "Project",
                    "WE26BGD0005 \u00b7 Emergency Shelter Kits"
                  ],
                  [
                    "Country",
                    "Bangladesh"
                  ],
                  [
                    "Requested",
                    "$250,000"
                  ],
                  [
                    "Owner",
                    "Daniel K."
                  ],
                  [
                    "Status",
                    "In development \u00b7 released 27 Aug 26"
                  ],
                  [
                    "Target date",
                    "31 Aug 26"
                  ],
                  [
                    "Implementing partner",
                    "Local partner"
                  ]
                ],
                "generated_at": "2026-08-11",
                "by": "daniel",
                "sections": [
                  {
                    "key": "summary",
                    "heading": "Title & summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Emergency Shelter Kits (WE26BGD0005) is a project proposed for Bangladesh in the 2026 budget year, requesting $250,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Background & need",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Cyclone-affected chars: 2,400 households in temporary shelter, 900 with no roofing sheet."
                            }
                          ],
                          [
                            {
                              "text": "Local partner has a warehouse at the upazila and a delivery record from 2025."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Shelter kits before the monsoon peak; unit cost $50 sits within the $250,000 envelope."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "objectives",
                    "heading": "Objectives",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Address the need identified in the assessment."
                            }
                          ],
                          [
                            {
                              "text": "Deliver the planned activities within the 2026 budget year and the country ceiling."
                            }
                          ],
                          [
                            {
                              "text": "Hand over to Local partner with no continuing dependency on Church funds."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "activities",
                    "heading": "Key activities",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Mobilise the implementing partner and confirm the site."
                            }
                          ],
                          [
                            {
                              "text": "Procure and deliver the planned inputs."
                            }
                          ],
                          [
                            {
                              "text": "Monitor delivery and report to the Area office."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "beneficiaries",
                    "heading": "Beneficiaries & location",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Location: Bangladesh."
                          }
                        ]
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Beneficiaries: to be confirmed from the assessment (see Background & need)."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "partner",
                    "heading": "Implementing partner",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Implementing partner: Local partner."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $250,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "timeline",
                    "heading": "Timeline",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Planned window: 1 Jan 26 \u2192 31 Aug 26."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "risks",
                    "heading": "Risks & assumptions",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Partner capacity and procurement lead times."
                            }
                          ],
                          [
                            {
                              "text": "Access and seasonal constraints at the site."
                            }
                          ],
                          [
                            {
                              "text": "Assumes the requested $250,000 is confirmed for the 2026 budget year at approval."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26BGD0005-concept-20",
              "audience": "specialist",
              "doc_id": "doc-WE26BGD0005-concept-19",
              "created_at": "2026-08-11",
              "by": "daniel",
              "active": false,
              "revoked_at": "2026-08-11",
              "revoked_by": "daniel"
            }
          ],
          "comments": []
        },
        "orgcheck": {
          "status": "done",
          "note": "HQ background check clear.",
          "updated_by": "priya",
          "updated_at": "2026-08-22",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": null,
          "docs": [
            {
              "id": "doc-WE26BGD0005-orgcheck-21",
              "kind": "orgpack",
              "title": "Organisation Background Check \u2014 Project Information Pack \u2014 Emergency Shelter Kits",
              "at": "2026-08-15",
              "by": "daniel",
              "model": {
                "id": "doc-WE26BGD0005-orgcheck-21",
                "kind": "orgpack",
                "kindLabel": "Organisation Background Check \u2014 Project Information Pack",
                "title": "Organisation Background Check \u2014 Project Information Pack \u2014 Emergency Shelter Kits",
                "subtitle": "WE26BGD0005 \u00b7 Bangladesh \u00b7 $250,000",
                "meta": [
                  [
                    "Project",
                    "WE26BGD0005 \u00b7 Emergency Shelter Kits"
                  ],
                  [
                    "Country",
                    "Bangladesh"
                  ],
                  [
                    "Requested",
                    "$250,000"
                  ],
                  [
                    "Owner",
                    "Daniel K."
                  ],
                  [
                    "Status",
                    "In development \u00b7 released 27 Aug 26"
                  ],
                  [
                    "Target date",
                    "31 Aug 26"
                  ],
                  [
                    "Implementing partner",
                    "Local partner"
                  ]
                ],
                "generated_at": "2026-08-15",
                "by": "daniel",
                "sections": [
                  {
                    "key": "purpose",
                    "heading": "Purpose of this pack",
                    "blocks": [
                      {
                        "t": "p",
                        "text": "Information pack for the organisation background check of the implementing partner, prepared for HQ review."
                      }
                    ]
                  },
                  {
                    "key": "record",
                    "heading": "Project record",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Project id",
                            "WE26BGD0005"
                          ],
                          [
                            "Name",
                            "Emergency Shelter Kits"
                          ],
                          [
                            "Country",
                            "Bangladesh"
                          ],
                          [
                            "Requested",
                            "$250,000"
                          ],
                          [
                            "Owner",
                            "Daniel K."
                          ],
                          [
                            "Implementing partner",
                            "Local partner"
                          ],
                          [
                            "Strategic priority",
                            "\u2014"
                          ],
                          [
                            "Classification",
                            "\u2014"
                          ],
                          [
                            "Target date",
                            "31 Aug 26"
                          ]
                        ]
                      }
                    ]
                  },
                  {
                    "key": "summary",
                    "heading": "Summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Emergency Shelter Kits (WE26BGD0005) is a project proposed for Bangladesh in the 2026 budget year, requesting $250,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Assessment findings",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Cyclone-affected chars: 2,400 households in temporary shelter, 900 with no roofing sheet."
                            }
                          ],
                          [
                            {
                              "text": "Local partner has a warehouse at the upazila and a delivery record from 2025."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Shelter kits before the monsoon peak; unit cost $50 sits within the $250,000 envelope."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "partner",
                    "heading": "Implementing partner",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Implementing partner: Local partner."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "checks",
                    "heading": "Checks requested",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          "Legal registration and governance of the partner",
                          "Sanctions and due-diligence screening",
                          "Track record with comparable projects",
                          "Financial controls and reporting capacity"
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $250,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "stages",
                    "heading": "Development stages",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Assessment",
                            "Done"
                          ],
                          [
                            "Project Concept",
                            "Done"
                          ],
                          [
                            "Org Background check",
                            "Done"
                          ],
                          [
                            "Area Humane Society Communication",
                            "Done"
                          ]
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26BGD0005-orgcheck-22",
              "audience": "hq",
              "doc_id": "doc-WE26BGD0005-orgcheck-21",
              "created_at": "2026-08-15",
              "by": "daniel",
              "active": false,
              "revoked_at": "2026-08-15",
              "revoked_by": "daniel"
            }
          ],
          "comments": []
        },
        "areacomm": {
          "status": "done",
          "note": "Area Humane Society informed; no overlap.",
          "updated_by": "daniel",
          "updated_at": "2026-08-26",
          "observations": [],
          "justification": "",
          "images": [],
          "draft": null,
          "docs": [
            {
              "id": "doc-WE26BGD0005-areacomm-23",
              "kind": "areapack",
              "title": "Area Humane Society Communication \u2014 Project Information Pack \u2014 Emergency Shelter Kits",
              "at": "2026-08-23",
              "by": "daniel",
              "model": {
                "id": "doc-WE26BGD0005-areacomm-23",
                "kind": "areapack",
                "kindLabel": "Area Humane Society Communication \u2014 Project Information Pack",
                "title": "Area Humane Society Communication \u2014 Project Information Pack \u2014 Emergency Shelter Kits",
                "subtitle": "WE26BGD0005 \u00b7 Bangladesh \u00b7 $250,000",
                "meta": [
                  [
                    "Project",
                    "WE26BGD0005 \u00b7 Emergency Shelter Kits"
                  ],
                  [
                    "Country",
                    "Bangladesh"
                  ],
                  [
                    "Requested",
                    "$250,000"
                  ],
                  [
                    "Owner",
                    "Daniel K."
                  ],
                  [
                    "Status",
                    "In development \u00b7 released 27 Aug 26"
                  ],
                  [
                    "Target date",
                    "31 Aug 26"
                  ],
                  [
                    "Implementing partner",
                    "Local partner"
                  ]
                ],
                "generated_at": "2026-08-23",
                "by": "daniel",
                "sections": [
                  {
                    "key": "purpose",
                    "heading": "Purpose of this pack",
                    "blocks": [
                      {
                        "t": "p",
                        "text": "Information pack for the Area Humane Society communication, prepared for the Area office."
                      }
                    ]
                  },
                  {
                    "key": "record",
                    "heading": "Project record",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Project id",
                            "WE26BGD0005"
                          ],
                          [
                            "Name",
                            "Emergency Shelter Kits"
                          ],
                          [
                            "Country",
                            "Bangladesh"
                          ],
                          [
                            "Requested",
                            "$250,000"
                          ],
                          [
                            "Owner",
                            "Daniel K."
                          ],
                          [
                            "Implementing partner",
                            "Local partner"
                          ],
                          [
                            "Strategic priority",
                            "\u2014"
                          ],
                          [
                            "Classification",
                            "\u2014"
                          ],
                          [
                            "Target date",
                            "31 Aug 26"
                          ]
                        ]
                      }
                    ]
                  },
                  {
                    "key": "summary",
                    "heading": "Summary",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Emergency Shelter Kits (WE26BGD0005) is a project proposed for Bangladesh in the 2026 budget year, requesting $250,000."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "background",
                    "heading": "Assessment findings",
                    "blocks": [
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "The assessment recorded the following observations:"
                          }
                        ]
                      },
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Cyclone-affected chars: 2,400 households in temporary shelter, 900 with no roofing sheet."
                            }
                          ],
                          [
                            {
                              "text": "Local partner has a warehouse at the upazila and a delivery record from 2025."
                            }
                          ]
                        ],
                        "ordered": false
                      },
                      {
                        "t": "h3",
                        "text": "Justification"
                      },
                      {
                        "t": "p",
                        "runs": [
                          {
                            "text": "Shelter kits before the monsoon peak; unit cost $50 sits within the $250,000 envelope."
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "key": "activities",
                    "heading": "Planned activities",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Mobilise the implementing partner and confirm the site."
                            }
                          ],
                          [
                            {
                              "text": "Procure and deliver the planned inputs."
                            }
                          ],
                          [
                            {
                              "text": "Monitor delivery and report to the Area office."
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "coordination",
                    "heading": "Coordination with the Area Humane Society",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          "Confirm no duplication with Society programmes in Bangladesh",
                          "Agree the communication line for beneficiaries and local authorities",
                          "Share the timeline and the point of contact (Daniel K.)"
                        ]
                      }
                    ]
                  },
                  {
                    "key": "budget",
                    "heading": "Budget summary",
                    "blocks": [
                      {
                        "t": "ul",
                        "items": [
                          [
                            {
                              "text": "Requested: $250,000"
                            }
                          ],
                          [
                            {
                              "text": "Budget year: 2026"
                            }
                          ]
                        ],
                        "ordered": false
                      }
                    ]
                  },
                  {
                    "key": "stages",
                    "heading": "Development stages",
                    "blocks": [
                      {
                        "t": "kv",
                        "rows": [
                          [
                            "Assessment",
                            "Done"
                          ],
                          [
                            "Project Concept",
                            "Done"
                          ],
                          [
                            "Org Background check",
                            "Done"
                          ],
                          [
                            "Area Humane Society Communication",
                            "Done"
                          ]
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          ],
          "links": [
            {
              "token": "rv-WE26BGD0005-areacomm-24",
              "audience": "area",
              "doc_id": "doc-WE26BGD0005-areacomm-23",
              "created_at": "2026-08-23",
              "by": "daniel",
              "active": false,
              "revoked_at": "2026-08-23",
              "revoked_by": "daniel"
            }
          ],
          "comments": []
        }
      }
    }
  },
  "dev_seq": 24,
  "schema_version": 4
};
