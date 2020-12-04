<?php 
class GestureParam { 
    public $id_gestureParam; 
    public $fk_gesture;
    public $value;
    public $order;
    
    //----- CONSTRUTOR -----
    function __construct($id_gestureParam, $fk_gesture, $value, $order)
    {
        $this->id_gestureParam = $id_gestureParam;
        $this->fk_gesture = $fk_gesture;
        $this->value = $value;
        $this->order = $order;
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
    function gestureParamToString()
    {
        $id_gestureParam = $this->getAttribute('id_gestureParam');
        $fk_gesture = $this->getAttribute('fk_gesture');
        $value = $this->getAttribute('value');
        $order = $this->getAttribute('order');
        
        return "GestureParam=[id_gestureParam:$id_gestureParam; fk_gesture: $fk_gesture; value: $value; order: $order]"; 
    }
    
} 

?> 