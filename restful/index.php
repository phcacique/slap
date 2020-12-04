<?php

// PUBLIC USER: http://localhost/animation/restful.php/publicuser/{username}
// STORYBOARDS BY USER: http://localhost/animation/restful.php/storyboards/{username}
// STORYBOARD USER AND BY ID: http://localhost/animation/restful.php/storyboard/{username}/{id}

ob_start();
require_once __DIR__ . "/../php/restful/restfulDAO.php";
ob_end_clean();

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
 
// retrieve the table and key from the path
$params = array();
while(sizeof($request)>0){
    array_push($params, preg_replace('/[^a-z0-9_]+/i','',array_shift($request)) );
}

$result = array();
if($params[0] == "publicuser" && $params[1]!=null){
    $result['user'] = getPublicUserByUsername($params[1]);
    $result['storyboardCount'] = countStoryboardsByUser($params[1]);
}
else if($params[0] == "storyboards" && $params[1]!=null){
    $result['user'] = getPublicUserByUsername($params[1]);
    $result['storyboardCount'] = countStoryboardsByUser($params[1]);
    $result['storyboards'] = getStoryboardsByUser($params[1]);
    
    for ($i=0; $i<sizeof($result['storyboards']); $i++){
        $frames = getFramesByStoryboard($result['storyboards'][$i]['id_storyboard']);
        for($j=0; $j<sizeof($frames); $j++){
            $layers = getLayersByFrame($frames[$j]['id_frame']);
            for($k=0; $k<sizeof($layers); $k++){
                $gestures = getGesturesByLayer($layers[$k]['id_layer']);
                
                for($m=0; $m<sizeof($gestures); $m++){
                    $gestures[$m]['params'] = getParamsByGesture($gestures[$m]['id_gesture']);
                }
                
                $layers[$k]['gestures'] = $gestures;
            }
            $frames[$j]['layers'] = $layers;
            
        }
        
        $result['storyboards'][$i]['frames'] = $frames;
    } 
}
else if($params[0] == "storyboard" && $params[1]!=null && $params[2]!=null){
    $result['user'] = getPublicUserByUsername($params[1]);
    $frames = getFramesByStoryboard($params[2]);    
    for($j=0; $j<sizeof($frames); $j++){
        $layers = getLayersByFrame($frames[$j]['id_frame']);

        for($k=0; $k<sizeof($layers); $k++){
            $gestures = getGesturesByLayer($layers[$k]['id_layer']);

            for($m=0; $m<sizeof($gestures); $m++){
                $gestures[$m]['params'] = getParamsByGesture($gestures[$m]['id_gesture']);
            }

            $layers[$k]['gestures'] = $gestures;
        }
        $frames[$j]['layers'] = $layers;

    }

    $result['storyboard']['info'] = getStoryboardById($params[2]);
    $result['storyboard']['frames'] = $frames;
    
    $duration = 0;
    $numImages = 0;
    for($i=0; $i<sizeof($frames); $i++){
        $duration += $frames[$i]['duration'];
        $numImages += sizeof($frames[$i]['layers']);
    }
    $result['storyboard']['info']['duration'] = $duration;
    $result['storyboard']['info']['totalImages'] = $numImages;
    
    
}

//echo format_json(json_encode($result, JSON_UNESCAPED_SLASHES), $html = true);
echo json_encode($result, JSON_UNESCAPED_SLASHES);

function format_json($json, $html = false) {
		$tabcount = 0; 
		$result = ''; 
		$inquote = false; 
		$ignorenext = false; 
		if ($html) { 
		    $tab = "&nbsp;&nbsp;&nbsp;"; 
		    $newline = "<br/>"; 
		} else { 
		    $tab = "\t"; 
		    $newline = "\n"; 
		} 
		for($i = 0; $i < strlen($json); $i++) { 
		    $char = $json[$i]; 
		    if ($ignorenext) { 
		        $result .= $char; 
		        $ignorenext = false; 
		    } else { 
		        switch($char) { 
		            case '{': 
		                $tabcount++; 
		                $result .= $char . $newline . str_repeat($tab, $tabcount); 
		                break; 
		            case '}': 
		                $tabcount--; 
		                $result = trim($result) . $newline . str_repeat($tab, $tabcount) . $char; 
		                break; 
		            case ',': 
		                $result .= $char . $newline . str_repeat($tab, $tabcount); 
		                break; 
		            case '"': 
		                $inquote = !$inquote; 
		                $result .= $char; 
		                break; 
		            case '\\': 
		                if ($inquote) $ignorenext = true; 
		                $result .= $char; 
		                break; 
		            default: 
		                $result .= $char; 
		        } 
		    } 
		} 
		return $result; 
	}

?>