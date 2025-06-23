import { FormControlLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ImportDak from "./ImportDak";
import ImportFile from "./ImportFile";

const ImportRepo = () => {
  const { t } = useTranslation();

  const [type, settype] = useState("dak");

  const handleChange = (event) => {
    settype(event.target.value);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <RadioGroup
          row
          aria-label="position"
          name="position"
          value={type}
          onChange={handleChange}
          defaultValue="dak"
        >
          <FormControlLabel
            value="dak"
            control={<Radio color="primary" />}
            label={t("dak")}
            labelPlacement="top"
          />
          <FormControlLabel
            value="file"
            control={<Radio color="primary" />}
            label={t("file")}
            labelPlacement="top"
          />
        </RadioGroup>
      </Grid>
      <Grid item>
        <div
          style={{
            display: type == "dak" ? "initial" : "none",
          }}
        >
          <ImportDak />
        </div>
        <div
          style={{
            display: type == "dak" ? "none" : "initial",
          }}
        >
          <ImportFile />
        </div>
      </Grid>
    </Grid>
  );
};

export default ImportRepo;
