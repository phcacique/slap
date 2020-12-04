<?php 
require_once __DIR__ . "/../storyboard/storyboard.php";
require_once __DIR__ . "/../user/user.php";
class Frame { 
    public $id_frame; 
    public $storyboard;
    public $num;
    public $duration;
    public $image;
    public $layers;
    public $activeTime;
    public $gestureTime;
    
    //----- CONSTRUTOR -----
    function __construct($id_frame, $storyboard, $num, $duration, $image)
    {
        $this->id_frame = $id_frame;
        $this->id_storyboard = $storyboard;
        $this->num = $num;
        $this->duration = $duration;
        $this->image = $image;
    }

    //----- GETTERS AND SETTERS -----
    function getAttribute($attributeName)
    {
       return $this->$attributeName;
    }
    
    function setAttribute($attributeName, $value)
    {
        $this->$attributeName = $value;
    }
    
    //----- TO STRING -----
    function frameToString()
    {
        $id_frame = $this->getAttribute('id_frame');
        $storyboard = $this->getAttribute('storyboard')->storyboardToString();
        $num = $this->getAttribute('num');
        $duration = $this->getAttribute('duration');
        $image = $this->getAttribute('image');
        $activeTime = $this->getAttribute('activeTime');
        $gestureTime = $this->getAttribute('gestureTime');
        $layers = $this->getAttribute('layers')->layerToString();
        return "Frame=[id_frame:$id_frame; storyboard: $storyboard; num: $num; duration: $duration; image: $image; layers: $layers; activeTime: $activeTime; gestureTime: $gestureTime]"; 
    }
    
    //----- TO SELECT ITEM -----
    function frameToSelectItem()
    {
        $id_frame = $this->getAttribute('id_frame');
        $num = $this->getAttribute('num');
        return "<option value='$id_frame'>$num</option>"; 
    }
    
} 

?> 