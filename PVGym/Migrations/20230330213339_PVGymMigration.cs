using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PVGym.Migrations
{
    public partial class PVGymMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluation_Member_MemberId",
                table: "Evaluation");

            migrationBuilder.DeleteData(
                table: "Member",
                keyColumn: "MemberId",
                keyValue: new Guid("1d08ff29-e040-452f-834c-96f99ede79b6"));

            migrationBuilder.DeleteData(
                table: "Member",
                keyColumn: "MemberId",
                keyValue: new Guid("8b91ee1d-aae9-42db-9818-b87a332a7b0f"));

            migrationBuilder.AlterColumn<Guid>(
                name: "MemberId",
                table: "Evaluation",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "Member",
                columns: new[] { "MemberId", "PlanType", "VAT" },
                values: new object[] { new Guid("0f9f95c0-5924-4196-8ebb-7fc818cb74b1"), 1, 234234586 });

            migrationBuilder.InsertData(
                table: "Member",
                columns: new[] { "MemberId", "PlanType", "VAT" },
                values: new object[] { new Guid("a8968c72-ad2a-4792-8ee3-315f96788794"), 0, 222222213 });

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluation_Member_MemberId",
                table: "Evaluation",
                column: "MemberId",
                principalTable: "Member",
                principalColumn: "MemberId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evaluation_Member_MemberId",
                table: "Evaluation");

            migrationBuilder.DeleteData(
                table: "Member",
                keyColumn: "MemberId",
                keyValue: new Guid("0f9f95c0-5924-4196-8ebb-7fc818cb74b1"));

            migrationBuilder.DeleteData(
                table: "Member",
                keyColumn: "MemberId",
                keyValue: new Guid("a8968c72-ad2a-4792-8ee3-315f96788794"));

            migrationBuilder.AlterColumn<Guid>(
                name: "MemberId",
                table: "Evaluation",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.InsertData(
                table: "Member",
                columns: new[] { "MemberId", "PlanType", "VAT" },
                values: new object[] { new Guid("1d08ff29-e040-452f-834c-96f99ede79b6"), 0, 222222213 });

            migrationBuilder.InsertData(
                table: "Member",
                columns: new[] { "MemberId", "PlanType", "VAT" },
                values: new object[] { new Guid("8b91ee1d-aae9-42db-9818-b87a332a7b0f"), 1, 234234586 });

            migrationBuilder.AddForeignKey(
                name: "FK_Evaluation_Member_MemberId",
                table: "Evaluation",
                column: "MemberId",
                principalTable: "Member",
                principalColumn: "MemberId");
        }
    }
}
