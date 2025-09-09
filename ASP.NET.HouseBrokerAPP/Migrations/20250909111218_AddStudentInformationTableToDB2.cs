using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ASP.NET.ASSIGNMENT.SEE.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentInformationTableToDB2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudentInformations",
                columns: table => new
                {
                    QatarID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Nationalty = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Grade = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Division = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    FatherPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    MatherPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UncalPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    OtherPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    HomeNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    StreetNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ZoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HealthNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DateOfRegistration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TypeOfDisability = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Severity = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LevelSuport = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Stat = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Diagnosis = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CaseDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IQ = table.Column<int>(type: "int", nullable: true),
                    DateOfClose = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReasonRorClosing = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    EntryStatus = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    formerSchool = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    formerLevel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ReportSource = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ReportDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Instr_W_St = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentInformations", x => x.QatarID);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentInformations");
        }
    }
}
