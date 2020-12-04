<?php 
class Gesture { 
    public $id_gesture; 
    public $fk_frameLayer;
    public $gestureType;
    public $params;
    
    //----- CONSTRUTOR -----
    function __construct($id_gesture, $fk_framelayer, $gestureType)
    {
        $this->id_gesture = $id_gesture;
        $this->fk_frameLayer = $fk_framelayer;
        $this->gestureType = $gestureType;
        $this->params = array();
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
    
    function addParam($p){
        $par = $this->getAttribute('params');
        array_push($par, $p);
        $this->setAttribute('params',$par);
    }
    
    //----- TO STRING -----
    function gestureToString()
    {
        $id_gesture = $this->getAttribute('id_gesture');
        $fk_frameLayer = $this->getAttribute('fk_frameLayer');
        $gestureType = $this->getAttribute('gestureType')->gestureTypeToString();
        $params = $this->getAttribute('params');
        
        return "Gesture=[id_gesture:$id_gesture; fk_frameLayer: $fk_frameLayer; gestureType:$gestureType ;params:".print_r($params)."]"; 
    }
    
} 

?> 