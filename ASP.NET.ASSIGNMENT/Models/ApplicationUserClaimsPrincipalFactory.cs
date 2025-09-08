using ASP.NET.HouseBrokerAPP.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace ASP.NET.ASSIGNMENT.Models
{
    public class ApplicationUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, IdentityRole>
    {
        public ApplicationUserClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager, IOptions<IdentityOptions> options)
            : base(userManager, roleManager, options)
        {
        }
        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);
            identity.AddClaim(new Claim("UserName", user.Name ?? ""));
            identity.AddClaim(new Claim("Street", user.Street ?? ""));
            identity.AddClaim(new Claim("City", user.City ?? ""));
            identity.AddClaim(new Claim("State", user.State ?? ""));
            identity.AddClaim(new Claim("PostalCode", user.PostalCode ?? ""));
            return identity;
        }
    }
}
