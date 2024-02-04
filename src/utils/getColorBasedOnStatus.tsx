import { Metric } from "@tremor/react";
import { OPENING_STATUS } from "../context/market.type";

export const getColorBasedOnStatus = (status?: string) => {
  switch (status) {
    case OPENING_STATUS.OPEN:
      return <Metric style={{ color: "#4caf50" }}>OPEN</Metric>;
    case OPENING_STATUS.CLOSED:
      return <Metric style={{ color: "#f44336" }}>CLOSED</Metric>;
    case OPENING_STATUS.EXTENDED_HOURS:
      return <Metric style={{ color: "#ffc107" }}>EXTENDED HOURS</Metric>;
    default:
      return <Metric>ERROR</Metric>;
  }
};
