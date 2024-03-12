import React, { useState } from 'react';
import { FaFontAwesome } from 'react-icons/fa';
import "./Dashboard.css"
import { getallProjects } from '../../service/allapi';
import "./Card.css"
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


//Added tooltip function

export function Card({ data }) {
  const renderTooltip = (title) => (
    <Tooltip id={title}>{title}</Tooltip>
  );
  return (
    <div className="col-xl-3 col-md-6 mb-4 cards">
      <OverlayTrigger
        placement="bottom"
        overlay={renderTooltip(data.title)}
      >
        <div className={`card border-left-${data.colors} shadow h-100 py-2 style-c`}>
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className={`text-xs font-weight-bold text-${data.colors} text-uppercase mb-1`}>
                  {data.title}
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {data.count}
                </div>
              </div>
              <div className="col-auto">
                {data.icon}
              </div>
            </div>
          </div>
        </div>
      </OverlayTrigger>
    </div>
  );
}
