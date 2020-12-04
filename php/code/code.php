<?php 

class Code { 
    public $id_redeem_code; 
    public $code;
    public $total_users;
    public $users;
    
    //----- CONSTRUTOR -----
    function __construct($id_redeem_code, $code, $total_users)
    {
        $this->id_redeem_code = $id_redeem_code;
        $this->code = $code;
        $this->total_users = $total_users;
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
    function codeToString()
    {
        $id_redeem_code = $this->getAttribute('id_redeem_code');
        $code = $this->getAttribute('code');
        $total_users = $this->getAttribute('total_users');
        
        return "Code=[id_redeem_code: $id_redeem_code, code: $code; total_users: $total_users]"; 
    }
    
    //----- TO SELECT ITEM -----
    function codeToSelectItem()
    {
        $id_redeem_code = $this->getAttribute('id_redeem_code');
        $code = $this->getAttribute('code');
        return "<option value='$id_redeem_code'>$code</option>"; 
    }
    
} 

?> 