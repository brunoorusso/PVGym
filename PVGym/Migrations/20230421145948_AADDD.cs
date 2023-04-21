using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PVGym.Migrations
{
    public partial class AADDD : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MemberPlan");

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("275d35a9-5520-4e47-b93c-cb9bef393762"));

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("325a27dd-43c3-414a-969b-4a9bcd45a5d4"));

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("c49b04e8-704d-4742-b0e6-fe0f413e9222"));

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("f64ab725-2337-442f-9674-8ad8337bfea0"));

            migrationBuilder.AddColumn<Guid>(
                name: "PlanId",
                table: "Member",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedBy",
                table: "Evaluation",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.InsertData(
                table: "AvailableClass",
                columns: new[] { "Id", "Description", "Duration", "Image", "Limit", "Name" },
                values: new object[,]
                {
                    { new Guid("1fe93bc8-2020-47f9-9b7c-413eb65bce22"), "Pilates is a low-impact fitness class that focuses on developing core strength, flexibility, and balance.", 60, "https://www.clubpilates.com/hubfs/11_studio_reformer-1.jpg", 40, "Pilates" },
                    { new Guid("484e641e-331d-4b62-9edc-c4fdae81d065"), "The class is designed to provide a full-body workout while also keeping participants engaged and motivated. Zumba is suitable for people of all fitness levels, as the routines can be modified to suit individual needs.", 60, "https://imgmedia.lbb.in/media/2021/01/5ffc657c8cb26612da74e667_1610376572334.jpg", 30, "Zumba" },
                    { new Guid("50c65a9d-7c38-4090-beb5-cb8bc21d2af8"), "Body Combat is a high-intensity, cardio-based fitness class that combines various martial arts techniques such as karate, boxing, and kickboxing.", 30, "https://www.fitnessfirst.co.uk/media/l2yngpvt/web-version-bodycombat-launch-kit-image-2.jpg?width=1200&height=1200&rnd=132955692406170000", 20, "Body Combat" },
                    { new Guid("fd9aef93-7a8e-4b02-a542-28cea7c6aa4e"), "The class is designed to increase flexibility, strength, and balance while also reducing stress and improving mental clarity.", 60, "https://i2-prod.nottinghampost.com/whats-on/whats-on-news/article1239433.ece/ALTERNATES/s1200c/yoga-GettyImages-846236570.jpg", 30, "Yoga" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Member_PlanId",
                table: "Member",
                column: "PlanId");

            migrationBuilder.AddForeignKey(
                name: "FK_Member_Plan_PlanId",
                table: "Member",
                column: "PlanId",
                principalTable: "Plan",
                principalColumn: "PlanId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Member_Plan_PlanId",
                table: "Member");

            migrationBuilder.DropIndex(
                name: "IX_Member_PlanId",
                table: "Member");

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("1fe93bc8-2020-47f9-9b7c-413eb65bce22"));

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("484e641e-331d-4b62-9edc-c4fdae81d065"));

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("50c65a9d-7c38-4090-beb5-cb8bc21d2af8"));

            migrationBuilder.DeleteData(
                table: "AvailableClass",
                keyColumn: "Id",
                keyValue: new Guid("fd9aef93-7a8e-4b02-a542-28cea7c6aa4e"));

            migrationBuilder.DropColumn(
                name: "PlanId",
                table: "Member");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Evaluation");

            migrationBuilder.CreateTable(
                name: "MemberPlan",
                columns: table => new
                {
                    MemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlansPlanId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberPlan", x => new { x.MemberId, x.PlansPlanId });
                    table.ForeignKey(
                        name: "FK_MemberPlan_Member_MemberId",
                        column: x => x.MemberId,
                        principalTable: "Member",
                        principalColumn: "MemberId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MemberPlan_Plan_PlansPlanId",
                        column: x => x.PlansPlanId,
                        principalTable: "Plan",
                        principalColumn: "PlanId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AvailableClass",
                columns: new[] { "Id", "Description", "Duration", "Image", "Limit", "Name" },
                values: new object[,]
                {
                    { new Guid("275d35a9-5520-4e47-b93c-cb9bef393762"), "Body Combat is a high-intensity, cardio-based fitness class that combines various martial arts techniques such as karate, boxing, and kickboxing.", 30, "https://www.fitnessfirst.co.uk/media/l2yngpvt/web-version-bodycombat-launch-kit-image-2.jpg?width=1200&height=1200&rnd=132955692406170000", 20, "Body Combat" },
                    { new Guid("325a27dd-43c3-414a-969b-4a9bcd45a5d4"), "The class is designed to provide a full-body workout while also keeping participants engaged and motivated. Zumba is suitable for people of all fitness levels, as the routines can be modified to suit individual needs.", 60, "https://imgmedia.lbb.in/media/2021/01/5ffc657c8cb26612da74e667_1610376572334.jpg", 30, "Zumba" },
                    { new Guid("c49b04e8-704d-4742-b0e6-fe0f413e9222"), "Pilates is a low-impact fitness class that focuses on developing core strength, flexibility, and balance.", 60, "https://www.clubpilates.com/hubfs/11_studio_reformer-1.jpg", 40, "Pilates" },
                    { new Guid("f64ab725-2337-442f-9674-8ad8337bfea0"), "The class is designed to increase flexibility, strength, and balance while also reducing stress and improving mental clarity.", 60, "https://i2-prod.nottinghampost.com/whats-on/whats-on-news/article1239433.ece/ALTERNATES/s1200c/yoga-GettyImages-846236570.jpg", 30, "Yoga" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_MemberPlan_PlansPlanId",
                table: "MemberPlan",
                column: "PlansPlanId");
        }
    }
}
