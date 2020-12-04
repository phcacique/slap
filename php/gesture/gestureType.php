<?php 
class GestureType { 
    public $id_gestureType; 
    public $name;
    
    //----- CONSTRUTOR -----
    function __construct($id_gestureType, $name)
    {
        $this->id_gestureType = $id_gestureType;
        $this->name = $name;
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
    function gestureTypeToString()
    {
        $id_gestureType = $this->getAttribute('id_gestureType');
        $name = $this->getAttribute('name');
        
        return "GestureType=[id_gestureType:$id_gestureType; name:$name]"; 
    }
    
} 

?> 