<?php

return [
    'work_status' => [
        'probation' => 0,
        'doing' => 1,
        'end' => 2,
    ],
    'log_request' => [
        'type' => [
            'leave' => 0,
            'OT' => 1
        ],
        'status' => [
            'pending' => 0,
            'approve' => 1,
            'reject' => 2
        ],
        'check_paid' => [
            'paid' => 0,
            'unpaid' => 1
        ],
        'time_leave' => [
            'morning' => 0,
            'afternoon' => 1,
            'allday' => 2
        ]
    ]
];