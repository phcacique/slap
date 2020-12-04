<?php 
class Symbol { 
    
    
    //----- CONSTRUTOR -----
    function __construct()
    {
        $this->id_frame = $id_frame;

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
    function symbolToString()
    {
        
    }
    
    //----- TO SELECT ITEM -----
    function symbolToSelectItem()
    {
//        $id_frame = $this->getAttribute('id_frame');
//        $num = $this->getAttribute('num');
//        return "<option value='$id_frame'>$num</option>"; 
    }
    
} 

?> 