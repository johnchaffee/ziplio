#!/bin/sh

# Create Postgres database tables and sample records

psql $DATABASE_URL << EOF

-- Create messages table
CREATE TABLE messages (
  ID SERIAL PRIMARY KEY,
  date_created VARCHAR(30),
  direction VARCHAR(10),
  twilio_number VARCHAR(40),
  mobile_number VARCHAR(40),
  conversation_id VARCHAR,
  body text,
  media_url VARCHAR
);

-- Create conversations table
CREATE TABLE conversations (
  ID SERIAL PRIMARY KEY,
  date_updated VARCHAR(30),
  conversation_id VARCHAR UNIQUE,
  contact_name VARCHAR,
  unread_count SMALLINT,
  status VARCHAR(10)
);

EOF

# Create Twilio Incoming Webhook for phone number

PHONE_METADATA=`curl "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers.json?Beta=false&PhoneNumber=$TWILIO_NUMBER" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN`

PHONE_SID=`echo $PHONE_METADATA | grep -o "sid\": \"PN\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w\w" | cut -c8-`

curl -X POST "https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/IncomingPhoneNumbers/$PHONE_SID.json" \
--data-urlencode "SmsUrl=https://$APP_HOST_NAME.herokuapp.com/twilio-webhook" \
-u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN



