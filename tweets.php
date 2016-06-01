<?php

require_once 'twitter-php/twitter.class.php';

//Twitter OAuth Settings, enter your settings here:
$CONSUMER_KEY = '9rEQ4gI7xzDpNkX3lyKcV8YLT';
$CONSUMER_SECRET = 'aV2Bc1YguJeNVZDgia132Sgj2tZIH3O4jEWuWiRkgtRg2eC4Bh';
$ACCESS_TOKEN = '4350868283-Vl0nEG6ERB23Eq164Rerx7cMOlz2SkFMIq7kjRJ';
$ACCESS_TOKEN_SECRET = 'RDvRheewlhvUkJ77i6fNMJgYlwg3y6dVNUrsAadXQ54Np';

$twitter = new Twitter($CONSUMER_KEY, $CONSUMER_SECRET, $ACCESS_TOKEN, $ACCESS_TOKEN_SECRET);

// retrieve data
$q = $_POST['q'];
$count = $_POST['count'];
$api = $_POST['api'];

// api data
$params = array(
	'screen_name' => $q,
	'q' => $q,
	'count' => 20,
    'result_type' => 'recent',
  'includes_rts' => false
);

$results = $twitter->search('#Benzema');

// output as JSON
echo json_encode($results);
?>