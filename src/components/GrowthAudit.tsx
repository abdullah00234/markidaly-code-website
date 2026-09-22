"use client";

import GrowthAuditHeader from "./growth-audit/GrowthAuditHeader";
import AuditProcess from "./growth-audit/AuditProcess";
import GrowthAuditCTA from "./growth-audit/GrowthAuditCTA";

export default function GrowthAudit() {
  return (
    <section id="growth-audit" className="bg-white py-24 lg:py-32">
      <div className="container-page">
        <GrowthAuditHeader />
        <AuditProcess />
        <GrowthAuditCTA />
      </div>
    </section>
  );
}
