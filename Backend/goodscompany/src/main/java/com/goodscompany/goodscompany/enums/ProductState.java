package com.goodscompany.goodscompany.enums;

import com.fasterxml.jackson.annotation.JsonEnumDefaultValue;

public enum ProductState {
    @JsonEnumDefaultValue ACTIVE(1, "Active"),
    DISCONTINUED(0, "Discontinued");

    private int state;
    private String valState;

    ProductState(int state, String val) {
        this.state = state;
        this.valState = val;
    }

    public Integer getId() {
        return state;
    }
    public void setVal(Integer val) {
        this.state = state;
    }
    public String getStringRep() {
        return valState;
    }
    public void setValStr(String valStr) {
        this.valState = valState;
    }

    public ProductState toggle() {
        if (this.equals(ACTIVE))
            return DISCONTINUED;
        else
            return ACTIVE;
    }

    @Override
    public String toString() {
        return getStringRep();
    }
}
