<?php 
class Layer { 
    public $id_layer; 
    public $id_frame;
    public $name_layer;
    public $index;
    public $visibility;
    public $gesture;
    public $image;
    
    //----- CONSTRUTOR -----
    function __construct($id_layer, $id_frame, $name_layer, $index, $visibility, $gesture, $image)
    {
        $this->id_layer = $id_layer;
        $this->id_frame = $id_frame;
        $this->name_layer = $name_layer;
        $this->index = $index;
        $this->visibility = $visibility;
        $this->gesture = $gesture;
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
    function layerToString()
    {
        $id_layer = $this->getAttribute('id_layer');
        $id_frame = $this->getAttribute('id_frame');
        $name_layer = $this->getAttribute('name_layer');
        $index = $this->getAttribute('index');
        $visibility = $this->getAttribute('visibility');
        $gesture = $this->getAttribute('gesture');
        $image = $this->getAttribute('image');
        
        return "Layer=[id_layer: $id_layer; id_frame:$id_frame; name_layer:$name_layer; visibility: $visibility; gesture: $gesture; image: $image]"; 
    }
    
} 

?> 