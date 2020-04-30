module.exports = {
    'buffers': {
        'req': 'req:27;id:gateway_name;pass:gateway_password;num:;signal:29;gsm_status:LOGIN;voip_status:LOGOUT;voip_state:IDLE;remain_time:-1;imei:867495023958030;imsi:260060172091324;iccid:89480611000720913242;pro:POL;idle:11;disable_status:0;SMS_LOGIN:N;SMB_LOGIN:;CELLINFO:LAC:7E5,CELL ID:5E5B;CGATT:Y;',
        'fake': 'key1:val1;key2:val2;key3:val3;'
    },
    'xmlDone': `<?xml version="1.0" encoding="utf-8"?>
    <send-sms-status>
        <id1>0000006d</id1>
        <status1>DONE</status1>
        <error1></error1>
        <id2></id2>
        <status2></status2>
        <error2></error2>
        <id3></id3>
        <status3></status3>
        <error3></error3>
        <id4></id4>
        <status4></status4>
        <error4></error4>
        <id5></id5>
        <status5></status5>
        <error5></error5>
        <id6></id6>
        <status6></status6>
        <error6></error6>
        <id7></id7>
        <status7></status7>
        <error7></error7>
        <id8></id8>
        <status8></status8>
        <error8></error8>
    </send-sms-status>`,
    'xmlError': `<?xml version="1.0" encoding="utf-8"?>
    <send-sms-status>
        <id1>0000006d</id1>
        <status1>Error</status1>
        <error1>error message</error1>
        <id2></id2>
        <status2></status2>
        <error2></error2>
        <id3></id3>
        <status3></status3>
        <error3></error3>
        <id4></id4>
        <status4></status4>
        <error4></error4>
        <id5></id5>
        <status5></status5>
        <error5></error5>
        <id6></id6>
        <status6></status6>
        <error6></error6>
        <id7></id7>
        <status7></status7>
        <error7></error7>
        <id8></id8>
        <status8></status8>
        <error8></error8>
    </send-sms-status>`,
    'xmlStartingStatus': `<?xml version="1.0" encoding="utf-8"?>
    <send-sms-status>
        <id1>0000006d</id1>
        <status1>startign</status1>
        <error1></error1>
        <id2></id2>
        <status2></status2>
        <error2></error2>
        <id3></id3>
        <status3></status3>
        <error3></error3>
        <id4></id4>
        <status4></status4>
        <error4></error4>
        <id5></id5>
        <status5></status5>
        <error5></error5>
        <id6></id6>
        <status6></status6>
        <error6></error6>
        <id7></id7>
        <status7></status7>
        <error7></error7>
        <id8></id8>
        <status8></status8>
        <error8></error8>
    </send-sms-status>`       
};