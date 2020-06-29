import React from 'react';
import './index.css'

const Loader = () => {
  return (
      <section class="loading-section">
          <div>
              <div>
                  <span class="hline6"></span>
                  <span class="hline3"></span>
              </div>
          </div>
          <div>
              <div>
                  <span class="hline1"></span>
                  <span class="hline4"></span>
              </div>
          </div>
          <div>
              <div>
                  <span class="hline5"></span>
                  <span class="hline2"></span>
              </div>
          </div>
      </section>
  );
};

export default Loader;