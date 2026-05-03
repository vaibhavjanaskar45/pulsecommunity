import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUs = () => {
  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col text-center">
          <h1 className="fw-bold">About Us</h1>
          <p className="text-muted">
            Our platform is designed to enhance community awareness, safety, and
            communication by providing real-time insights and engagement tools.
          </p>
        </div>
      </div>

      <div className="row gy-4">
        {/* Crime Monitoring */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="card-title fw-semibold">Crime Monitoring</h4>
              <p className="card-text text-muted">
                Stay informed with real-time crime data and heatmaps. Our
                platform highlights areas with higher crime intensity to help
                individuals and communities take preventive measures and stay
                safe.
              </p>
            </div>
          </div>
        </div>

        {/* Public Chat */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="card-title fw-semibold">Public Chat</h4>
              <p className="card-text text-muted">
                A secure, real-time chat feature where users can discuss local
                events, share information, and collaborate on safety measures
                with the community.
              </p>
            </div>
          </div>
        </div>

        {/* Weather Updates */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="card-title fw-semibold">Weather Updates</h4>
              <p className="card-text text-muted">
                Get live weather forecasts and alerts to stay prepared for
                changing conditions in your locality, ensuring safety and
                planning.
              </p>
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="card-title fw-semibold">News Updates</h4>
              <p className="card-text text-muted">
                Access verified news headlines and updates to stay informed
                about important events happening around your community and the
                world.
              </p>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="col-md-12">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h4 className="card-title fw-semibold">Public Announcements</h4>
              <p className="card-text text-muted">
                Authorities and community leaders can share important
                announcements, alerts, and guidelines with everyone in real
                time, ensuring smooth communication and public awareness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="row mt-5">
        <div className="col text-center">
          <h2 className="fw-bold">Our Mission</h2>
          <p className="text-muted">
            We are committed to empowering communities with data-driven
            insights, transparent communication, and real-time updates that
            improve public safety, awareness, and collaboration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
